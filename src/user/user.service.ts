import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
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

      const user = await this.getUserById(id);
      const merged = this.usersRepository.merge(user, {
        ...dto
      })
      await this.usersRepository.update(id, merged);
      return await this.getUserById(id)
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

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.
      createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne();
    if (!user) {
      throw new ApiException(ErrorMessages.USER_NOT_FOUND);
    } else if (!user.isActived) {
      throw new ForbiddenException("Account is locked")
    }
    else if (user.isDeleted) throw new BadRequestException("Account is Deleted")
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

  async getUsers(pagination: Pagination) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder("users")
      .orderBy("users.createdAt", pagination.order)
      .where('users.isActived = :isActived', { isActived: true })
      .andWhere('users.isDeleted = :isDeleted', { isDeleted: false })
      .take(pagination.take)
      .skip(pagination.skip)

      const [users, itemCount] = await queryBuilder.getManyAndCount();

    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(users, meta);

  }
}
