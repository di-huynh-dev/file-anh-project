import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ResumesService } from './resumes.service'
import { CreateUserCVDto } from './dto/create-resume.dto'
import { UpdateResumeDto } from './dto/update-resume.dto'
import { ResponseMessage, User } from 'src/auth/decorator/customize'
import { IUser } from 'src/users/user.interface'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Tạo CV thành công!')
  create(@Body() createUserCVDto: CreateUserCVDto, @User() user: IUser) {
    return this.resumesService.create(createUserCVDto, user)
  }

  @Get()
  @ResponseMessage('Lấy tất cả CV thành công!')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.resumesService.findAll(+currentPage, +limit, qs)
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin CV thành công!')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id)
  }

  @Post('by-user')
  @ResponseMessage('Lấy thông tin CV thành công!')
  findByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin CV thành công!')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa CV thành công!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user)
  }
}
