import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserCVDto } from './dto/create-resume.dto'
import { UpdateResumeDto } from './dto/update-resume.dto'
import { IUser } from 'src/users/user.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Resume, ResumeDocument } from './schemas/resume.schema'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import aqp from 'api-query-params'
import mongoose from 'mongoose'

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) {}
  async create(createUserCVDto: CreateUserCVDto, user: IUser) {
    const newCV = await this.resumeModel.create({
      ...createUserCVDto,
      email: user.email,
      userId: user._id,
      status: 'PENDING',
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    })
    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt,
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const offset = (+currentPage - 1) * +limit
    const defaultLimit = +limit ? +limit : 10
    const totalItems = (await this.resumeModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec()

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found company with ${id}`)
    }
    return await this.resumeModel.findById({ _id: id })
  }

  async findByUser(user: IUser) {
    return await this.resumeModel
      .find({
        userId: user._id,
      })
      .sort('-createdAt')
      .populate([
        { path: 'companyId', select: { name: 1 } },
        { path: 'jobId', select: { name: 1 } },
      ])
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found company with ${id}`)
    }

    return await this.resumeModel.updateOne(
      { _id: id },
      {
        status: updateResumeDto.status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: updateResumeDto.status,
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
            updatedAt: new Date(),
          },
        },
      },
    )
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found company with ${id}`)
    }

    await this.resumeModel.updateOne(
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
    return this.resumeModel.softDelete({
      _id: id,
    })
  }
}
