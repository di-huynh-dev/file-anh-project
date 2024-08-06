import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import mongoose from 'mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { IUser } from './user.interface'
import aqp from 'api-query-params'
import { Role, RoleDocument } from 'src/roles/schemas/role.schema'
import { USER_ROLE } from 'src/databases/sample'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }

  // async create(email: string, password: string, name: string) {
  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExistingEmail = await this.userModel.findOne({ email: createUserDto.email })
    if (isExistingEmail) {
      throw new HttpException('Email đã tồn tại!', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = this.hashPassword(createUserDto.password)
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    })
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, address, age, gender } = registerUserDto
    const isExistingEmail = await this.userModel.findOne({ email })
    if (isExistingEmail) {
      throw new HttpException(`Email ${email} đã tồn tại!`, HttpStatus.BAD_REQUEST)
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE })

    const hashPassword = this.hashPassword(password)
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id,
    })
    return newUser
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const offset = (+currentPage - 1) * +limit
    const defaultLimit = +limit ? +limit : 10
    const totalItems = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.userModel
      .find(filter, { ...projection, password: 0 })
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

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new HttpException('Not valid user id', HttpStatus.NOT_FOUND)
    }
    return this.userModel
      .findOne(
        {
          _id: id,
        },
        {
          password: 0,
        },
      )
      .populate({ path: 'role', select: { name: 1, _id: 1 } })
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1 } })
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword)
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    )
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new HttpException('Not valid user id', HttpStatus.NOT_FOUND)
    }

    const foundUser = await this.userModel.findById({ _id: id })
    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa tài khoản admin')
    }
    await this.userModel.updateOne(
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
    return this.userModel.softDelete({
      _id: id,
    })
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      {
        _id,
      },
      {
        refreshToken,
      },
    )
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    return (await this.userModel.findOne({ refreshToken })).populate({
      path: 'role',
      select: { name: 1 },
    })
  }
}
