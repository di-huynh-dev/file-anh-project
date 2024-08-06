import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string

  @IsNotEmpty({ message: 'email không được để trống!' })
  @IsEmail({ message: 'email có định dạng là email!' })
  email: string

  @IsNotEmpty({ message: 'Skills không được để trống!' })
  @IsArray({ message: 'Skills có định dạng là array!' })
  @IsString({ each: true, message: 'Skill có định dạng string!' })
  skills: string[]
}
