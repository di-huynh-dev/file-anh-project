import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { SubscribersService } from './subscribers.service'
import { UpdateSubscriberDto } from './dto/update-subscriber.dto'
import { ResponseMessage, SkipCheckPermission, User } from 'src/auth/decorator/customize'
import { IUser } from 'src/users/user.interface'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post('skills')
  @ResponseMessage("Get subscriber's skills")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user)
  }

  @Get()
  @ResponseMessage('Lấy tất cả subcribers thành công!')
  findAll(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.subscribersService.findAll(+currentPage, +limit, qs)
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin subcriber thành công!')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id)
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Cập nhật thông tin subcriber thành công!')
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa subcriber thành công!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user)
  }
}
