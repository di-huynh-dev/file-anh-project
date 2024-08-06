import { IsMongoId, IsNotEmpty } from 'class-validator'
import mongoose from 'mongoose'

export class CreateResumeDto {
  @IsNotEmpty({ message: 'email không được bỏ trống!' })
  email: string

  @IsNotEmpty({ message: 'userId không được bỏ trống!' })
  userId: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'url không được bỏ trống!' })
  url: string

  @IsNotEmpty({ message: 'companyId không được bỏ trống!' })
  @IsMongoId({ message: 'companyId có kiểu dữ liệu là mongo id' })
  companyId: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'jobId không được bỏ trống!' })
  @IsMongoId({ message: 'jobId có kiểu dữ liệu là mongo id' })
  jobId: mongoose.Schema.Types.ObjectId
}

export class CreateUserCVDto {
  @IsNotEmpty({ message: 'url không được bỏ trống!' })
  url: string

  @IsNotEmpty({ message: 'companyId không được bỏ trống!' })
  @IsMongoId({ message: 'companyId có kiểu dữ liệu là mongo id' })
  companyId: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'jobId không được bỏ trống!' })
  @IsMongoId({ message: 'jobId có kiểu dữ liệu là mongo id' })
  jobId: mongoose.Schema.Types.ObjectId
}
