import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(pagination: Pagination, filter?: FactoryFilterDTO): Promise<PaginationModel<Factory>> {
    const queryBuilder: SelectQueryBuilder<Factory> = this.factoryRepository.createQueryBuilder('factory');

    queryBuilder
      .take(pagination.take)
      .skip(pagination.skip)
      .where('factory.isDelete = :isDelete', { isDelete: false })
      .leftJoinAndSelect('factory.user', 'user')
      .leftJoinAndSelect('factory.devices', 'devices')
      .leftJoinAndSelect('devices.deviceType', 'deviceType');


    const { column } = filter;
    if (pagination.search && column) {
      queryBuilder.andWhere(`factory.${column} ILike :search`, { search: `%${pagination.search}%` })

    }
    queryBuilder.orderBy(`factory.${column}`, pagination.order)
    // queryBuilder.orderBy(`factory.facName`, pagination.order)


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
