import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Public, ResponseMessage, User } from 'src/auth/decorator/customize'
import { IUser } from './user.interface'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ResponseMessage('Tạo người dùng thành công!')
  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user)
  }

  @Get()
  @ResponseMessage('Lấy danh sách người dùng thành công!')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.usersService.findAll(+currentPage, +limit, qs)
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy thông tin người dùng thành công!')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch()
  @ResponseMessage('Cập nhật thông tin người dùng thành công!')
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user)
  }
}
