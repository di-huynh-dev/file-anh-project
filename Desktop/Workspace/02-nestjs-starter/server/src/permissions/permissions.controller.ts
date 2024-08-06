import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { ResponseMessage, User } from 'src/auth/decorator/customize'
import { IUser } from 'src/users/user.interface'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Tạo permission thành công!')
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user)
  }

  @Get()
  @ResponseMessage('Lấy tất cả permissions thành công!')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.permissionsService.findAll(+currentPage, +limit, qs)
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin permission thành công!')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Chỉnh sửa permission thành công!')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa permission thành công!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user)
  }
}
