import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { IUser } from 'src/users/user.interface'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { ConfigService } from '@nestjs/config'
import ms from 'ms'
import { Response, Request } from 'express'
import { RolesService } from 'src/roles/roles.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService: RolesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username)
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password)
      if (isValid) {
        const userRole = user.role as unknown as { _id: string; name: string }
        const temp = await this.roleService.findOne(userRole._id)
        const objUser = {
          ...user.toObject(),
          permissions: temp?.permissions ?? [],
        }
        return objUser
      }
    }
    return null
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role, permissions } = user
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    }
    //Create refresh token
    const refreshToken = this.createRefreshToken(payload)

    //Update user with refresh token
    await this.usersService.updateUserToken(refreshToken, _id)

    //set refresh token into cookies
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) * 1000,
    })

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        permissions,
      },
    }
  }

  async register(registerUser: RegisterUserDto) {
    return await this.usersService.register(registerUser)
  }

  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    })
    return refreshToken
  }

  renewToken = async (request: Request, response: Response) => {
    try {
      const refreshToken = request.cookies['refresh_token']
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      })

      //Check refresh token valid
      const user = await this.usersService.findUserByRefreshToken(refreshToken)

      // fetch user roles
      const userRole = user.role as unknown as { _id: string; name: string }
      const temp = await this.roleService.findOne(userRole._id)

      if (!user) {
        throw new BadRequestException('Refresh token không hợp lệ. Vui lòng đăng nhập!')
      } else {
        const { _id, name, email, role } = user

        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        }
        //Create refresh token
        const refreshToken = this.createRefreshToken(payload)

        //Update user with refresh token
        await this.usersService.updateUserToken(refreshToken, _id.toString())

        //delete old cookies
        response.clearCookie('refresh_token')

        //set refresh token into cookies
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) * 1000,
        })

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
            permissions: temp?.permissions ?? [],
          },
        }
      }
    } catch (error) {
      throw new BadRequestException('Refresh token không hợp lệ. Vui lòng đăng nhập!')
    }
  }

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id)
    response.clearCookie('refresh_token')
    return 'OK'
  }
}
