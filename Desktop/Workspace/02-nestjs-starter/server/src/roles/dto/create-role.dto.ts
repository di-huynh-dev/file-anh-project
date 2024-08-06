import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator'
import mongoose from 'mongoose'

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name không được để trống!' })
  name: string

  @IsNotEmpty({ message: 'name không được để trống!' })
  description: string

  @IsNotEmpty({ message: 'isActive không được để trống!' })
  @IsBoolean({ message: 'isActive có kiểu dữ liệu boolean!' })
  isActive: boolean

  @IsNotEmpty({ message: 'isActive không được để trống!' })
  @IsMongoId({ each: true, message: 'Mỗi phần tử phải có kiểu dữ liệu là object id' })
  @IsArray({ message: 'permissions có kiểu dữ liệu là array!' })
  permissions: mongoose.Schema.Types.ObjectId[]
}
