import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Note } from 'src/common/decorator/description.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenModel } from './model/token.model';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Role } from 'src/common/enum/auth';
@ApiTags("API AUTHENTICATION")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Note("Đăng nhập")
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      ADMIN: {
        value: {
          username: 'admin',
          password: '123456',
        } as CreateAuthDto,
      },
      TECHNICAL: {
        value: {
          username: 'technical',
          password: '123456',
        } as CreateAuthDto,
      },
      CUSTOMER: {
        value: {
          username: 'customer',
          password: '123456',
        } as CreateAuthDto,
      }
    },
  })
  @Post('login')
  async login(@Body() dto: CreateAuthDto, @AuthUser() user: User) {

    return this.authService.login(user);
  }


  @Post('register')
  @Note("Đăng ký")
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      ADMIN: {
        value: {
          username: 'admin',
          password: '123456',

        } as CreateAuthDto,
      },
      TECHNICAL: {
        value: {
          username: 'technical',
          password: '123456',
        } as CreateAuthDto,
      },
      CUSTOMER: {
        value: {
          username: 'customer',
          password: '123456',
        } as CreateAuthDto,
      }
    },
  })
  createUser(@Body() dto: CreateAuthDto) {
    const createUserDTO: CreateUserDto = {
      username: dto.username,
      password: dto.password,
      role: dto.username == 'admin' ? Role.ADMIN : dto.username == 'technical' ? Role.TECHNICAL : Role.CUSTOMER
    };
    return this.userService.createUser(createUserDTO);
  }

  @Post("refresh-tokens")
  @Note("Lấy lại token mới khi hết hạn")
  @UseGuards(RefreshAuthGuard)
  async refreshTokens(
    @AuthUser() myUser: User,
    @Body() dto: RefreshTokenDto,
  ): Promise<TokenModel> {
    return this.authService.refreshToken(myUser);

  }
}
