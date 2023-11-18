import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from 'src/common/enum/auth';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { QueryIdDto } from 'src/common/dto/query-id.dto';
import { Note } from 'src/common/decorator/description.decorator';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { UpdateUserProfileDto } from './dto/update-profile-user.dto';
import { RolesGuard } from 'src/auth/guard/role.guard';
@ApiTags("API USER")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @Note('Lấy thông tin người dùng')
  async getAccount(@AuthUser() user: User) {
    return user;
  }

  @Get('gets')
  @Roles(Role.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @Note('Lấy thông tin tất cả người dùng')
  async getAllUsers(@Query() pagination: Pagination) {
    return await this.userService.getUsers(pagination);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post('grantAccessAdmin')
  async grantAccessAdmin(@Query() { id }: QueryIdDto): Promise<User> {
    return await this.userService.grantAccessAdmin(id);
  }
  ////////////////////////////////////////////////////////////////
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @Put('updateUser')
  // @ApiQuery({
  //   enum: Role,
  //   name: 'role'
  // })
  async updateUser(@AuthUser() user: User, /*@Query('role') role: Role,*/ @Body() dto: UpdateUserProfileDto): Promise<User | any> {
    return await this.userService.updateUser(user.id, {
      ...dto
    });
  }
  ////////////////////update by admin////////////////////////////////////////////
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Put('updateUserByAdmin')
  @ApiQuery({
    enum: Role,
    name: 'role'
  })
  async updateUserByAdmin(@Query() { id }: QueryIdDto, @Query('role') role: Role, @Body() dto: UpdateUserDto): Promise<User> {

    return await this.userService.updateUser(id, {
      ...dto,
      role
    });
  }
}
