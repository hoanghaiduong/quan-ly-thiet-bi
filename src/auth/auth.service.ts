import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { TokenModel } from './model/token.model';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from 'src/common/exception/api.exception';
import * as bcrypt from 'bcrypt';
import { ErrorMessages } from 'src/exception/error.code';
import { Role } from 'src/common/enum/auth';
export interface IJwtPayload {
  id: string;
  username: string;
  role: Role;
}



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService) {
  }

  async login(user: User) {
    const model = await this.getTokens(user);
    return {
      user,
      ...model
    };
  }
  private async getTokens(user: User): Promise<TokenModel> {
    const payload: IJwtPayload = {
      username: user.username,
      id: user.id,
      role: user.role
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
          expiresIn: '7d', // 7 days
        })
    ])
    return new TokenModel(accessToken, refreshToken)
  }

  private async getAccessToken(user: User): Promise<TokenModel> {
    const payload: IJwtPayload = {
      username: user.username,
      id: user.id,
      role: user.role
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return new TokenModel(accessToken)
  }
  async validateJwt(payload: IJwtPayload): Promise<User> {
    return await this.userService.getUserById(payload.id);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByUserName(username);
    if (!user) throw new ApiException(ErrorMessages.USER_NOT_FOUND)
    const isMatch = await bcrypt.compare(pass, user.password);
    return isMatch ? user : null;
  }

  async refreshToken(myUser: User): Promise<any> {
    return await this.getAccessToken(myUser);
  }
  async validateUserRefreshToken(id: string, refreshToken: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
      })
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          throw new ApiException(ErrorMessages.REFRESH_TOKEN_EXPIRED)
        case 'JsonWebTokenError':
          throw new ApiException(ErrorMessages.REFRESH_TOKEN_INVALID)
        default:
          throw new UnauthorizedException()
      }
    }
  }
}
