import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailPlan } from './entities/detail-plan.entity';
import { ILike, Repository } from 'typeorm';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { WorkStatusService } from 'src/work-status/work-status.service';
import { PlanService } from 'src/plan/plan.service';
import { DeviceService } from 'src/device/device.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enum/auth';

@Injectable()
export class DetailPlanService {
  constructor(
    @InjectRepository(DetailPlan)
    private readonly detailPlanRepository: Repository<DetailPlan>,
    private readonly workStatusService: WorkStatusService,
    private readonly planService: PlanService,
    private readonly deviceService: DeviceService,
  ) { }

  async create(dto: CreateDetailPlanDto, user: User): Promise<DetailPlan> {
    try {
      const [plan, device, workStatus] = await Promise.all([
        this.planService.findOne(dto.planId),
        this.deviceService.findOne(dto.deviceId),
        this.workStatusService.findOne(dto.workStatusId)
      ]);
      const detailPlan = this.detailPlanRepository.create({
        ...dto,
        plan,
        device,
        workStatus,
        typePlan: user.role === Role.ADMIN ? "PM" : "CM"
      });
      return await this.detailPlanRepository.save(detailPlan);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
    const [entities, itemCount] = await this.detailPlanRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: {
        createdAt: pagination.order
      },
      where: [
        { typePlan: pagination.search ? ILike(`%${pagination.search}%`) : null },
        {
          specification: pagination.search ? ILike(`%${pagination.search}%`) : null,
        },
        {
          unit: pagination.search ? ILike(`%${pagination.search}%`) : null,
        },
        {
          notes: pagination.search ? ILike(`%${pagination.search}%`) : null,
        }
      ],
      relations: ['workStatus', 'plan', 'device']
    });
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<DetailPlan>(entities, meta);
  }

  async findOne(id: string): Promise<DetailPlan> {
    const detailPlan = await this.detailPlanRepository.findOne({
      where: {
        id
      }
    });
    if (!detailPlan) {
      throw new NotFoundException('Detail Plan not found');
    }
    return detailPlan;
  }

  async update(id: string, dto: UpdateDetailPlanDto): Promise<DetailPlan> {
    const [plan, device, workStatus] = await Promise.all([
      this.planService.findOne(dto.planId),
      this.deviceService.findOne(dto.deviceId),
      this.workStatusService.findOne(dto.workStatusId)
    ]);
    const detailPlan = await this.findOne(id); // Check if the detail plan exists
    detailPlan.plan = plan;
    detailPlan.device = device;
    detailPlan.workStatus = workStatus;
    const merged = this.detailPlanRepository.merge(detailPlan, dto);
    return await this.detailPlanRepository.save(merged);
  }

  async remove(id: string): Promise<DetailPlan> {
    const detailPlan = await this.findOne(id); // Check if the detail plan exists
    await this.detailPlanRepository.remove(detailPlan);
    return detailPlan;
  }
}
