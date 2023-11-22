import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailPlan } from './entities/detail-plan.entity';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { WorkStatusService } from 'src/work-status/work-status.service';
import { PlanService } from 'src/plan/plan.service';
import { DeviceService } from 'src/device/device.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enum/auth';
import { ETypePlan } from './dto/query.dto';
type relationshipFind = "dailyDivision" | "plan" | "device"
@Injectable()
export class DetailPlanService {

  constructor(
    @InjectRepository(DetailPlan)
    private readonly detailPlanRepository: Repository<DetailPlan>,
    private readonly planService: PlanService,
    private readonly deviceService: DeviceService,
  ) { }

  async create(dto: CreateDetailPlanDto, user: User): Promise<DetailPlan> {
    try {
      const [plan, device] = await Promise.all([
        this.planService.findOne(dto.planId),
        this.deviceService.findOne(dto.deviceId),

      ]);
      const detailPlan = this.detailPlanRepository.create({
        ...dto,
        plan,
        device,
        typePlan: user.role === Role.ADMIN ? "PM" : "CM"
      });
      return await this.detailPlanRepository.save(detailPlan);
    } catch (error) {
      throw new BadRequestException(error);

    }
  }

  async statisticPlan(type: ETypePlan): Promise<{
    typePM?: {
      plan: number;
      target: number;
      done: number;
      total: number;
    },
    typeCM?: {
      found: number;
      target: number;
      done: number;
      total: number;
    }
  }
    | any> {
    //lấy số lượng thuộc type
    const queryBuilder = this.detailPlanRepository.createQueryBuilder('detail_plan');
    //thống kê tổng kế hoạch
    const totalCountQuery = await queryBuilder
      .select('COUNT(detail_plan.id)', 'totalTask')
      .where('detail_plan.typePlan = :type', { type })
      .getRawOne();
    //Thống kê kế hoạch dã hoàn thành
    const totalDone = await queryBuilder
      .select('COUNT(detail_plan.id)', 'totalDone')
      .where('detail_plan.typePlan = :type', { type })
      .andWhere('detail_plan.status = 1')
      .getRawOne();


    const percentageTask = (totalCountQuery?.totalTask / totalCountQuery.totalTask) * 100;
    const percentageDone = (totalDone?.totalDone / totalDone.totalDone) * 100;

    return {
      totalCountQuery,
      percentageTask,
      percentageDone,
      totalDone
    }


  }

  async findAll(pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
    const queryBuilder: SelectQueryBuilder<DetailPlan> = this.detailPlanRepository.createQueryBuilder('detailPlan');

    queryBuilder
      .take(pagination.take)
      .skip(pagination.skip)
      .orderBy('detailPlan.createdAt', pagination.order)
      .leftJoin('detailPlan.plan', 'plan')
      .leftJoin('detailPlan.device', 'device')
      .leftJoin('detailPlan.dailyDivision', 'daily_division');
    if (pagination.search) {
      queryBuilder
        .andWhere('(detailPlan.typePlan ILIKE :search OR detailPlan.specification ILIKE :search OR detailPlan.unit ILIKE :search OR detailPlan.notes ILIKE :search)', { search: `%${pagination.search}%` });
    }

    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<DetailPlan>(entities, meta);
  }

  async findOne(id: string): Promise<DetailPlan> {
    const detailPlan = await this.detailPlanRepository.findOne({
      where: {
        id
      },

    });
    if (!detailPlan) {
      throw new NotFoundException('Detail Plan not found');
    }
    return detailPlan;
  }
  async findOneWithRelationShip(id: string, relations?: relationshipFind[]): Promise<DetailPlan> {
    const detailPlan = await this.detailPlanRepository.findOne({
      where: {
        id,
      },
      relations
    })
    if (!detailPlan) throw new NotFoundException(`Detail Plan not found`)
    return detailPlan
  }
  async update(id: string, dto: UpdateDetailPlanDto): Promise<DetailPlan> {
    const [plan, device] = await Promise.all([
      this.planService.findOne(dto.planId),
      this.deviceService.findOne(dto.deviceId),

    ]);
    const detailPlan = await this.findOne(id); // Check if the detail plan exists
    detailPlan.plan = plan;
    detailPlan.device = device;

    const merged = this.detailPlanRepository.merge(detailPlan, dto);
    return await this.detailPlanRepository.save(merged);
  }

  async remove(id: string): Promise<DetailPlan> {
    const detailPlan = await this.findOne(id); // Check if the detail plan exists
    await this.detailPlanRepository.remove(detailPlan);
    return detailPlan;
  }
}
