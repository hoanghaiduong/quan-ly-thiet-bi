// plan.service.ts

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { QueryDateDTO } from 'src/common/dto/query-date.dto';

@Injectable()
export class PlanService {

  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) { }

  async clonePlanByMonth(month: number, year: number): Promise<Plan[] | any> {
    // Tính ngày đầu tiên của tháng và ngày cuối cùng của tháng
    const firstDayOfMonth = new Date(year, month - 1, 1); // Month is zero-based
    const lastDayOfMonth = new Date(year, month, 0);

    // Truy vấn tất cả các kế hoạch trong khoảng thời gian của tháng và năm đó
    const plansToClone = await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.beginDate >= :firstDayOfMonth AND plan.endDate <= :lastDayOfMonth', {
        firstDayOfMonth,
        lastDayOfMonth,
      })
      .loadAllRelationIds()
      .getMany();


    //Tạo bản sao của từng kế hoạch và tăng ngày lên một tháng
    const clonedPlans: Plan[] = [];
    for (const plan of plansToClone) {
      const clonedPlan = this.planRepository.create({
        ...plan,
        id: undefined,
        beginDate: this.incrementDateMonth(new Date(plan.beginDate), 1).toLocaleDateString(), // Tăng ngày lên một tháng
        endDate: this.incrementDateMonth(new Date(plan.endDate), 1).toLocaleDateString(),     // Tăng ngày lên một tháng
        isCopy: true,
      });

      // Lưu trữ bản sao vào mảng
      const savePlans = await this.planRepository.save(clonedPlan)
      clonedPlans.push(savePlans);
    }

    return clonedPlans;
  }
  async clonePlan(dto: CLonePlanDTO): Promise<Plan[]> {
    const plan = await this.findOne(dto.planId);
    const clonedPlans: Plan[] = [];
    for (let i = 0; i < dto.quantity; i++) {
      const creating = this.planRepository.create({
        ...plan,
        isCopy: true,
        id: undefined,
        beginDate: this.incrementDate(new Date(plan.beginDate), i * dto.daysToAdd).toLocaleDateString(),
        endDate: this.incrementDate(new Date(plan.endDate), i * dto.daysToAdd).toLocaleDateString(),
      });
      const clonedPlan = await this.planRepository.save(creating);
      clonedPlans.push(clonedPlan);
    }
    return clonedPlans;
  }
  private incrementDate(date: Date, daysToAdd: number): Date {
    // const newDate = new Date(date);
    // newDate.setDate(newDate.getDate() + daysToAdd);
    // return newDate;
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }
  private incrementDateMonth(date: Date, monthsToAdd: number): Date {
    // const newDate = new Date(date);
    // newDate.setMonth(newDate.getMonth() + monthsToAdd);
    // return newDate;

    date.setMonth(date.getMonth() + monthsToAdd);
    return date;
  }
  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      const plan = this.planRepository.create(createPlanDto);
      return await this.planRepository.save(plan);
    } catch (error) {
      throw new BadRequestException(error);
    }

  }



  async findAll(pagination: Pagination, date: QueryDateDTO): Promise<PaginationModel<Plan>> {
    const queryBuilder: SelectQueryBuilder<Plan> = this.planRepository.createQueryBuilder('plan');

    queryBuilder.where([
      { isDelete: false },
      { contents: pagination.search ? ILike(`%${pagination.search}%`) : null, }
    ]);
    // let checkDate = pagination.options;
    // if (checkDate) {
    //   queryBuilder.andWhere(
    //     '((:checkDate >= plan.beginDate AND :checkDate <= plan.endDate) OR (:checkDate >= plan.beginDate AND plan.endDate IS NULL))',
    //     { checkDate },
    //   );
    // }
    const { day, month, year } = date;

    if (day && month && year) {

      const checkDate = new Date(year, month - 1, day).toLocaleDateString(); // assuming day, month, year are 1-indexed
      Logger.debug(checkDate)
      queryBuilder.andWhere(':checkDate = plan.beginDate OR :checkDate = plan.endDate', { checkDate });
    }
    else if (month !== undefined && year !== undefined) {
      const firstDayOfMonth = new Date(year, month - 1, 1).toLocaleDateString();
      const lastDayOfMonth = new Date(year, month, 0).toLocaleDateString();
      //tìm trong tháng
      queryBuilder.andWhere('plan.beginDate >= :firstDayOfMonth AND plan.endDate <= :lastDayOfMonth', {
        firstDayOfMonth,
        lastDayOfMonth,
      });
      //tìm cả ngoài tháng
      // queryBuilder.andWhere('(DATE_TRUNC(\'month\', plan.beginDate) = :firstDayOfMonth OR DATE_TRUNC(\'month\', plan.endDate) = :firstDayOfMonth)', {
      //   firstDayOfMonth,
      // });
    } else if (year !== undefined) {
      const firstDayOfYear = new Date(year, 0, 1).toLocaleDateString();
      const lastDayOfYear = new Date(year, 11, 31, 23, 59, 59).toLocaleDateString();
      queryBuilder.andWhere('plan.beginDate >= :firstDayOfYear AND plan.endDate <= :lastDayOfYear', {
        firstDayOfYear,
        lastDayOfYear,
      });
    }

    const [entities, itemCount] = await queryBuilder
      .orderBy({
        'plan.beginDate': pagination.order, // Sắp xếp theo beginDate
        'plan.endDate': pagination.order,   // Sắp xếp theo endDate
        'plan.createdAt': pagination.order, // Sắp xếp theo createdAt (nếu cần)
      })
      .skip(pagination.skip)
      .take(pagination.take)
      .loadAllRelationIds()
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
