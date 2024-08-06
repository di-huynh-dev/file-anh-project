import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { Public, ResponseMessage, User } from './decorator/customize'
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto'
import { Request, Response } from 'express'
import { IUser } from 'src/users/user.interface'
import { RolesService } from 'src/roles/roles.service'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private roleService: RolesService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @ResponseMessage('Đăng nhập thành công!')
  @ApiBody({ type: UserLoginDto })
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response)
  }

  @Public()
  @ResponseMessage('Đăng ký tài khoản thành công !')
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser)
  }

  @Get('account')
  @ResponseMessage('Lấy thông tin người dùng thành công!')
  async getProfile(@User() user: IUser) {
    const temp = (await this.roleService.findOne(user.role._id)) as any
    user.permissions = temp.permissions

    return { user }
  }

  @Public()
  @Get('refresh')
  @ResponseMessage('Refresh token thành công!')
  refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.renewToken(request, response)
  }

  @Post('logout')
  @ResponseMessage('Đăng xuất thành công!')
  logout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
    return this.authService.logout(response, user)
  }
}
