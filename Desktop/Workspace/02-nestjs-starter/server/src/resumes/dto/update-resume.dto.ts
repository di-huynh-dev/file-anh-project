import { IsNotEmpty } from 'class-validator'

export class UpdateResumeDto {
  @IsNotEmpty({ message: 'Status không được để trống!' })
  status: string
}
