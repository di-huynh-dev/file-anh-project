import { IsNotEmpty } from 'class-validator'

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'name không được bỏ trống!' })
  name: string

  @IsNotEmpty({ message: 'apiPath không được bỏ trống!' })
  apiPath: string

  @IsNotEmpty({ message: 'module không được bỏ trống!' })
  module: string

  @IsNotEmpty({ message: 'method không được bỏ trống!' })
  method: string
}
