import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query, Logger } from '@nestjs/common';
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
import { ERelatedUser } from './type/type-query.enum';

import { ChangePasswordDTO } from './dto/change-password.dto';
import { FilterUserDTO } from './dto/query-filter.dto';
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
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.TECHNICAL)
  @UseGuards(JwtAuthGuard)

  @Note('Lấy thông tin tất cả người dùng')
  async getAllUsers(@Query() pagination: Pagination, @Query() filter: FilterUserDTO) {

    return await this.userService.getUsers(pagination, filter);
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


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  ////////////////////update by admin////////////////////////////////////////////
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Put('updateUserByAdmin')
  @ApiQuery({
    enum: Role,
    name: 'role'
  })
  async updateUserByAdmin(@Query() { id }: QueryIdDto, @Query('role') role: Role, @Body() dto: UpdateUserProfileDto): Promise<User> {

    return await this.userService.updateUser(id, {
      ...dto,
      role
    });
  }

  @Get('get-relation-by-user')
  @ApiQuery({
    name: 'relation',
    enum: ERelatedUser
  })
  async getFactoriesByUser(@Query('id') id: string, @Query('relation') relation: string): Promise<User> {
    return await this.userService.getRelation(id, relation);
  }
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Put('change-password-by-admin')
  async changePasswordByAdmin(@Query('id') id: string, @Body() dto: ChangePasswordDTO): Promise<User> {
    return await this.userService.changePasswordByAdmin(id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(@Body() dto: ChangePasswordDTO, @AuthUser() user: User): Promise<User> {
    return await this.userService.changePassword(user, dto);
  }

  @Get('users-statistics')
  async getUsersStatistics(): Promise<any> {
    return await this.userService.getUsersStatistics();
  }
}
