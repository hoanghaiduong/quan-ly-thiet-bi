// plan.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) { }

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      const plan = this.planRepository.create(createPlanDto);
      return await this.planRepository.save(plan);
    } catch (error) {
      throw new BadRequestException(error);
    }

  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Plan>> {
    const [entities, itemCount] = await this.planRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      where: {
        isDelete: false,
        contents: pagination.search ? ILike(`%${pagination.search}%`) : null
      },
      order: {
        createdAt: pagination.order
      }
    });

    const meta = new Meta({
      itemCount,
      pagination,
    });

    return new PaginationModel<Plan>(entities, meta);
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: {
        id, isDelete: false
      }
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    try {
      const plan = await this.findOne(id); // Ensure the plan exists
      const merged = this.planRepository.merge(plan, updatePlanDto);
      const saved = await this.planRepository.save(merged);
      return saved
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string): Promise<Plan> {
    const plan = await this.findOne(id);
    plan.isDelete = true;
    return await this.planRepository.save(plan);
  }
}
