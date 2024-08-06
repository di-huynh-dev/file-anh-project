import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { Public, ResponseMessage, User } from 'src/auth/decorator/customize'
import { IUser } from 'src/users/user.interface'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Tạo công việc mới thành công!')
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user)
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy tất cả công việc thành công!')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.jobsService.findAll(+currentPage, +limit, qs)
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Lấy thông tin công việc thành công!')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật công việc thành công!')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(id, updateJobDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa công việc thành công!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user)
  }
}
