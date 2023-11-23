import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApiException } from 'src/common/exception/api.exception';
import { ErrorMessages } from 'src/exception/error.code';
import { Role } from 'src/common/enum/auth';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { UpdateUserProfileDto } from './dto/update-profile-user.dto';
import { ERelatedUser } from './type/type-query.enum';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { FilterUserDTO } from './dto/query-filter.dto';
type RelatedUser = "factories" | "plans" | "dailyVisions" | "notifications"
@Injectable()
export class UserService {
  //     throw new ApiException(ErrorMessages.USER_NOT_FOUND);
  //   } else if (!user.isActived) {
  //     throw new ForbiddenException("Account is locked")
  //   }
  //   else if (user.isDeleted) throw new BadRequestException("Account is Deleted")
  //   return user;
  // }


  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

  async changePasswordByAdmin(id: string, dto: ChangePasswordDTO): Promise<User> {
    //Logger.debug((await bcrypt.hash(dto.oldPassword,10)))
    const user = await this.getUserById(id);
    const check = await bcrypt.compare(dto.oldPassword, user.password);
    if (!check) throw new BadRequestException("Invalid old password");
    user.password = await bcrypt.hash(dto.newPassword, 10);
    return await this.usersRepository.save(user);
  }
  async changePassword(currentUser: User, dto: ChangePasswordDTO): Promise<User> {
    const user = await this.getUserById(currentUser.id);
    const check = await bcrypt.compare(dto.oldPassword, user.password);
    if (!check) throw new BadRequestException("Invalid old password");
    user.password = await bcrypt.hash(dto.newPassword, 10);
    return await this.usersRepository.save(user);
  }
  async createUser(dto: CreateUserDto): Promise<User> {
    if (await this.existsUsername(dto.username)) {
      throw new ApiException(ErrorMessages.USER_ALREADY_EXIST);
    }
    const userCreated = this.usersRepository.create({
      ...dto,
    });
    return this.usersRepository.save(userCreated);
  }
  async updateUser(id: string, dto: UpdateUserProfileDto): Promise<User | any> {
    try {

      const user = await this.getUserByIdNoException(id);
      // const merged = this.usersRepository.merge(user, {
      //   ...dto,
      //   // password: '123456'
      // })
      // await this.usersRepository.update(id, merged);
      // return await this.getUserByIdNoException(id);
      await this.usersRepository.save({
        ...user,
        ...dto
      })
      return await this.getUserByIdNoException(id);
    } catch (error) {
      throw new ApiException(ErrorMessages.BAD_REQUEST, `Update User failed with error: ${error}`);
    }
  }
  async grantAccessAdmin(id: string): Promise<User> {
    try {
      const user = await this.getUserById(id);
      user.role = Role.ADMIN;
      return await this.usersRepository.save(user)
    } catch (error) {
      throw new ApiException(ErrorMessages.BAD_REQUEST, "Error grant access admin")
    }
  }
  async getRelation(id: string, relation?: string | RelatedUser[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        isDeleted: false,
        isActived: true
      },
      relations: typeof relation === "string" ? [relation] : relation
    })
    if (!user) throw new ApiException(ErrorMessages.USER_NOT_FOUND)
    return user;
  }
  // async getUserById(id: string): Promise<User> {
  //   const user = await this.usersRepository.
  //     createQueryBuilder('users')
  //     .where('users.id = :id', { id })
  //     .getOne();
  //   if (!user) {
  //     throw new ApiException(ErrorMessages.USER_NOT_FOUND);
  //   } else if (!user.isActived) {
  //     throw new ForbiddenException("Account is locked")
  //   }
  //   else if (user.isDeleted) throw new BadRequestException("Account is Deleted")
  //   return user;
  // }
  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        isDeleted: false,
        isActived: true
      }
    })
    if (!user) throw new ApiException(ErrorMessages.USER_NOT_FOUND);
    return user;
  }
  async getUserByIdNoException(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id
      }
    })
    if (!user) throw new ApiException(ErrorMessages.USER_NOT_FOUND);
    return user;
  }
  async getUserByUserName(username: string): Promise<User> {
    return await this.usersRepository.
      createQueryBuilder('users')
      .where('users.username = :username', { username })
      .getOne();
  }

  async existsUsername(username: string): Promise<boolean> {
    return await this.usersRepository.exist({ where: { username } })
  }

  async getUsers(pagination: Pagination, filter: FilterUserDTO) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder("users")
      .where('users.isActived = :isActived', { isActived: true })
      .andWhere('users.isDeleted = :isDeleted', { isDeleted: false })
      .take(pagination.take)
      .skip(pagination.skip);
    const { column } = filter;
    if (pagination.search && column) {
      queryBuilder.andWhere(
        `users.${column} ILIKE :search`,
        { search: `%${pagination.search}%` }
      );
    }

    queryBuilder.orderBy("users.createdAt", pagination.order); // Move orderBy outside of the if statement

    const [users, itemCount] = await queryBuilder.getManyAndCount();

    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(users, meta);
  }
  async getUsersStatistics(): Promise<any> {
    //  const users=
  }
}
