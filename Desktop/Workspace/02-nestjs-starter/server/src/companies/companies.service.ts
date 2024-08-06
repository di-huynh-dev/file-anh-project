import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { Company, CompanyDocument } from './schemas/company.schema'
import { InjectModel } from '@nestjs/mongoose'
import { IUser } from 'src/users/user.interface'
import { User } from 'src/auth/decorator/customize'
import aqp from 'api-query-params'
import mongoose from 'mongoose'

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const offset = (+currentPage - 1) * +limit
    const defaultLimit = +limit ? +limit : 10
    const totalItems = (await this.companyModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec()

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found company with ${id}`)
    }
    return await this.companyModel.findById(id)
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    const updatedCompany = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    )
    return updatedCompany
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    )
    return this.companyModel.softDelete({
      _id: id,
    })
  }
}
