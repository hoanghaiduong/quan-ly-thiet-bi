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

  async findAll(pagination: Pagination): Promise<PaginationModel<Factory>> {
    const queryBuilder: SelectQueryBuilder<Factory> = this.factoryRepository.createQueryBuilder('factory');

    queryBuilder
      .take(pagination.take)
      .skip(pagination.skip)
      .orderBy('factory.facName', pagination.order)
      .leftJoin('factory.user', 'user');

    const whereConditions: { [key: string]: any } = {
      isDelete: false,
    };

    if (pagination.search) {
      Object.assign(whereConditions, {
        facName: ILike(`%${pagination.search}%`),
        alias: ILike(`%${pagination.search}%`),
        address: ILike(`%${pagination.search}%`),
        phone: ILike(`%${pagination.search}%`),
        phone2: ILike(`%${pagination.search}%`),
      });
    }

    queryBuilder.where(whereConditions);

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

  async update(id: string, factoryDto: UpdateFactoryDto): Promise<Factory> {
    const existingFactory = await this.findOne(id);

    if (!existingFactory) {
      throw new NotFoundException('Factory not found');
    }

    this.factoryRepository.merge(existingFactory, factoryDto);
    return await this.factoryRepository.save(existingFactory);
  }


}
