import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factory } from './entities/factory.entity';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { UserService } from 'src/user/user.service';
import { EFactoryFilterType, FactoryFilterDTO } from './dto/factory-filter.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FactoryService {
  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
    private readonly userService: UserService
  ) { }

  async create(factoryDto: CreateFactoryDto): Promise<Factory> {
    try {
      const newFactory = this.factoryRepository.create(factoryDto);
      return await this.factoryRepository.save(newFactory);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll(pagination: Pagination, user?: User, filter?: FactoryFilterDTO): Promise<PaginationModel<Factory>> {
    const queryBuilder = this.factoryRepository.createQueryBuilder('factory');
    queryBuilder
      .take(pagination.take)
      .skip(pagination.skip)
    if (!user) {
      queryBuilder
        .where('factory.isDelete = :isDelete', { isDelete: false })
        .leftJoinAndSelect('factory.user', 'user')
        .leftJoinAndSelect('factory.devices', 'devices')
        .leftJoinAndSelect('devices.deviceType', 'deviceType');
    }
    else {
      queryBuilder
        .andWhere(`factory.user.id = :user`, { user: user.id })
        .leftJoinAndSelect('factory.devices', 'devices')
        .leftJoinAndSelect('devices.deviceType', 'deviceType');
    }


    if (filter) {
      const { column } = filter;
      if (column && pagination.search) {

        // Depending on the filter type, you may need to adjust the WHERE clause accordingly
        switch (column) {
          case EFactoryFilterType.user:
            queryBuilder.andWhere(`user.id = :search`, { search: pagination.search });
            break;

          case EFactoryFilterType.RoleOfUser:

            queryBuilder.andWhere(`user.username ILIKE :search`, { search: `%${pagination.search}%` });

            break;

          case EFactoryFilterType.devices:
            queryBuilder
              .leftJoinAndSelect('factory.devices', 'device')
              .andWhere(`device.id = :search`, { search: pagination.search });
            break;

          case EFactoryFilterType.typeOfDevice:

            queryBuilder.andWhere(`deviceType.id = :search`, { search: pagination.search });
            break;

          default:
            queryBuilder.andWhere(`factory.${column} ILIKE :search`, { search: `%${pagination.search}%` });
            break;
        }
      }
    }
    queryBuilder.orderBy(`factory.createdAt`, pagination.order);

    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const meta = new Meta({ pagination, itemCount });
    return new PaginationModel<Factory>(entities, meta);
  }

  async findOne(id: string): Promise<Factory> {
    const factory = await this.factoryRepository.findOne({
      where: {
        id,
        isDelete: false
      }
    });

    if (!factory) {
      throw new NotFoundException('Factory not found');
    }

    return factory;
  }
  async findOneWithRelation(id: string): Promise<Factory> {
    const factory = await this.factoryRepository.findOne({
      where: {
        id,
        isDelete: false
      },
      relations: ["user"]
    });

    if (!factory) {
      throw new NotFoundException('Factory not found');
    }

    return factory;
  }
  async update(id: string, factoryDto: UpdateFactoryDto): Promise<Factory> {
    try {
      const existingFactory = await this.findOne(id);

      if (!existingFactory) {
        throw new NotFoundException('Factory not found');
      }

      this.factoryRepository.merge(existingFactory, factoryDto);
      return await this.factoryRepository.save(existingFactory);

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


}
