import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ResponseMessage, User } from 'src/auth/decorator/customize'
import { IUser } from 'src/users/user.interface'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Tạo role thành công!')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user)
  }

  @Get()
  @ResponseMessage('Lấy tất cả roles thành công!')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.rolesService.findAll(+currentPage, +limit, qs)
  }

  @Get(':id')
  @ResponseMessage('Xem chi tiết role thành công!')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật role thành công!')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa role thành công!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user)
  }
}
