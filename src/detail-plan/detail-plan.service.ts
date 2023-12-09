import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailPlan } from './entities/detail-plan.entity';
import { ILike, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { WorkStatusService } from 'src/work-status/work-status.service';
import { PlanService } from 'src/plan/plan.service';
import { DeviceService } from 'src/device/device.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enum/auth';
import { ETypePlan } from './dto/query.dto';
import { EDetailPlanFilter, FilterDetailPlanDTO } from './dto/filter-detail-plan.dto';
import moment from 'moment';
import { format } from 'date-fns';
import { UserService } from 'src/user/user.service';
import { CreateDetailPlanDtoByCustomer } from './dto/create-detail-plan-customer.dto';
type relationshipFind = "dailyDivision" | "plan" | "device" | "device.factory" | "device.deviceType" | "user"
@Injectable()
export class DetailPlanService {


  constructor(
    @InjectRepository(DetailPlan)
    private readonly detailPlanRepository: Repository<DetailPlan>,
    private readonly planService: PlanService,
    private readonly deviceService: DeviceService,
    private readonly userService: UserService
  ) { }
  async reportError(dto: CreateDetailPlanDtoByCustomer, userId: string): Promise<DetailPlan | any> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'numeric' });

      const plan = await this.planService.getPlanByDate({
        month: parseInt(currentMonth),
        year: new Date().getFullYear()
      });
      const [device, user] = await Promise.all([
        this.deviceService.findOne(dto.deviceId),
        this.userService.getUserById(userId)
      ]);
      const detailPlan = this.detailPlanRepository.create({
        ...dto,
        plan,
        device,
        user,
        typePlan: ETypePlan.CM
      });
      return await this.detailPlanRepository.save(detailPlan);

    } catch (error) {
      throw new BadRequestException(error);

    }
  }
  async create(dto: CreateDetailPlanDto, userId: string): Promise<DetailPlan> {
    try {
      const [plan, device, user] = await Promise.all([
        this.planService.findOne(dto.planId),
        this.deviceService.findOne(dto.deviceId),
        this.userService.getUserById(userId)
      ]);
      const detailPlan = this.detailPlanRepository.create({
        ...dto,
        plan,
        device,
        user,
        typePlan: user.role === Role.ADMIN ? "PM" : "CM"
      });
      return await this.detailPlanRepository.save(detailPlan);
    } catch (error) {
      throw new BadRequestException(error);

    }
  }

  async statisticDetailPlan(typePlan: ETypePlan): Promise<any> {
    const totalRecords = await this.detailPlanRepository.count({
      where: {
        typePlan
      }
    });//lấy tất cả bản ghi thuộc typePlan


    // Completed PM or CM Statistics
    const completedRecords = await this.detailPlanRepository.count({
      where: {
        typePlan,
        status: 1
      }
    })
    // Completed PM or CM Statistics
    const pendingRecords = await this.detailPlanRepository.count({
      where: {
        typePlan,
        status: 2
      }
    })
    const unCompletedRecords = await this.detailPlanRepository.count({
      where: {
        typePlan,
        status: 0
      }
    })
    // Device Statistics
    const deviceStatistics = await this.detailPlanRepository
      .createQueryBuilder('detail_Plan')
      .select('device.id', 'deviceId')
      .addSelect('COUNT(detail_Plan.id)', 'recordCount')
      .where('detail_Plan.typePlan = :typePlan', { typePlan })
      .andWhere('detail_Plan.status = 1') // You can add additional conditions here if needed
      .leftJoin('detail_Plan.device', 'device')
      .groupBy('device.id')
      .getRawMany();
    const devicePercentage = deviceStatistics.map((deviceStat) => ({
      deviceId: deviceStat.deviceId,
      percentage: (deviceStat.recordCount / totalRecords) * 100,
    }));
    const completedPercentage = (completedRecords / totalRecords) * 100;
    const pendingPercentage = (pendingRecords / totalRecords) * 100;
    const unCompletedPercentage = (unCompletedRecords / totalRecords) * 100;
    return {
      totalRecords,

      completed: {
        count: completedRecords,
        percentage: completedPercentage,
      },
      pending: {
        count: pendingRecords,
        percentage: pendingPercentage
      },
      unCompleted: {
        count: unCompletedRecords,
        percentage: unCompletedPercentage
      },
      device: devicePercentage,
    };

  }

  async findAll(filter: FilterDetailPlanDTO, pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
    try {
      const queryBuilder: SelectQueryBuilder<DetailPlan> = this.detailPlanRepository.createQueryBuilder('detailPlan');
      const { planId, column } = filter;
      queryBuilder
        .take(pagination.take)
        .skip(pagination.skip)
        .where('detailPlan.plan.id = :planId', { planId })
        // .leftJoinAndSelect('detailPlan.plan', 'plan')
        .leftJoinAndSelect('detailPlan.device', 'device')
        .leftJoinAndSelect('device.factory', 'factory') // Assuming 'factory' is the property name for the factory relationship in the Device entity
        .leftJoinAndSelect('detailPlan.dailyDivision', 'dailyDivision');
      if (pagination.search && column) {
        if (column === EDetailPlanFilter.deviceId) {
          // Convert the UUID to text before applying strict equality
          queryBuilder.andWhere(`detailPlan.${column} = :search`, { search: pagination.search });
        }
        else if (column === EDetailPlanFilter.factoryId) {
          // Use JoinAlias for nested relationship
          queryBuilder.leftJoinAndSelect(column, 'factoryAlias') // Assuming 'factory' is the property name for the factory relationship in the Device entity
          queryBuilder.andWhere(`factoryAlias.id = :search`, { search: pagination.search });
        }
        else if (column === EDetailPlanFilter.dailyDivision) {
          // Use the correct alias in the WHERE clause
          queryBuilder.andWhere(`${column} = :search`, { search: pagination.search });
        }
        else {
          queryBuilder.andWhere(`detailPlan.${column} ILIKE :search`, { search: `%${pagination.search}%` });
        }
      }

      queryBuilder.orderBy('detailPlan.createdAt', pagination.order)
      const [entities, itemCount] = await queryBuilder.getManyAndCount();

      const meta = new Meta({ itemCount, pagination });
      return new PaginationModel<DetailPlan>(entities, meta);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findAllDetailPlan(pagination: Pagination, column?: EDetailPlanFilter): Promise<PaginationModel<DetailPlan>> {
    try {
      const queryBuilder: SelectQueryBuilder<DetailPlan> = this.detailPlanRepository.createQueryBuilder('detailPlan');

      queryBuilder
        .take(pagination.take)
        .skip(pagination.skip)
        .where('detailPlan.status != 1')
        .andWhere('DATE(detailPlan.expectedDate) = :date', { date: new Date().toLocaleDateString() })
        .leftJoinAndSelect('detailPlan.device', 'device')
        .leftJoinAndSelect('device.factory', 'factory') // Assuming 'factory' is the property name for the factory relationship in the Device entity
        .leftJoinAndSelect('detailPlan.user', 'user')
        .leftJoinAndSelect('detailPlan.dailyDivision', 'dailyDivision')

      if (pagination.search && column) {
        if (pagination.search && column) {
          if (column === EDetailPlanFilter.deviceId) {
            // Convert the UUID to text before applying strict equality
            queryBuilder.andWhere(`detailPlan.${column} = :search`, { search: pagination.search });
          }
          else if (column === EDetailPlanFilter.factoryId) {
            // Use JoinAlias for nested relationship
            queryBuilder.leftJoinAndSelect(column, 'factoryAlias') // Assuming 'factory' is the property name for the factory relationship in the Device entity
            queryBuilder.andWhere(`factoryAlias.id = :search`, { search: pagination.search });
          }
          else if (column === EDetailPlanFilter.dailyDivision) {
            // Use the correct alias in the WHERE clause
            queryBuilder.andWhere(`${column} = :search`, { search: pagination.search });
          }
          else {
            queryBuilder.andWhere(`detailPlan.${column} ILIKE :search`, { search: `%${pagination.search}%` });
          }
        }
      }

      queryBuilder.orderBy('detailPlan.createdAt', pagination.order)
      const [entities, itemCount] = await queryBuilder.getManyAndCount();

      const meta = new Meta({ itemCount, pagination });
      return new PaginationModel<DetailPlan>(entities, meta);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
