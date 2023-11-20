// plan.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';
import { isISO8601 } from 'class-validator';
import { CLonePlanDTO } from './dto/clone-plan-query.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) { }
  async clonePlan(dto: CLonePlanDTO): Promise<Plan[]> {
    const plan = await this.findOne(dto.planId);
    const clonedPlans: Plan[] = [];
    for (let i = 0; i < dto.quantity; i++) {
      const creating = this.planRepository.create({
        ...plan,
        isCopy: true,
        id: undefined,
        beginDate: this.incrementDate(plan.beginDate, i * dto.daysToAdd),
        endDate: this.incrementDate(plan.endDate, i * dto.daysToAdd),
      });
      const clonedPlan = await this.planRepository.save(creating);
      clonedPlans.push(clonedPlan);
    }
    return clonedPlans;
  }
  private incrementDate(date: Date, daysToAdd: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
  }

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      const plan = this.planRepository.create(createPlanDto);
      return await this.planRepository.save(plan);
    } catch (error) {
      throw new BadRequestException(error);
    }

  }



  async findAll(pagination: Pagination): Promise<PaginationModel<Plan>> {
    const queryBuilder: SelectQueryBuilder<Plan> = this.planRepository.createQueryBuilder('plan');

    queryBuilder.where([
      { isDelete: false },
      { contents: pagination.search ? ILike(`%${pagination.search}%`) : null, }
    ]);
    let checkDate = pagination.options;
    if (checkDate) {
      queryBuilder.andWhere(
        '((:checkDate >= plan.beginDate AND :checkDate <= plan.endDate) OR (:checkDate >= plan.beginDate AND plan.endDate IS NULL))',
        { checkDate },
      );
    }

    const [entities, itemCount] = await queryBuilder
      .orderBy({ 'plan.createdAt': pagination.order })
      .skip(pagination.skip)
      .take(pagination.take)
      .getManyAndCount();

    const meta = new Meta({
      itemCount,
      pagination,
    });

    return new PaginationModel<Plan>(entities, meta);
  }
  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
      relations: ['detailPlans', 'dailyVisions', 'user']
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
