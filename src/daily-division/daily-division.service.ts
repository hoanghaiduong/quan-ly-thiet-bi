import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDailyDivisionDto } from './dto/create-daily-division.dto';
import { UpdateDailyDivisionDto } from './dto/update-daily-division.dto';
import { DailyDivision } from './entities/daily-division.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { DeviceService } from 'src/device/device.service';  // Import DeviceService
import { PlanService } from 'src/plan/plan.service';  // Import PlanService
import { UserService } from 'src/user/user.service';  // Import UserService
import { WorkStatusService } from 'src/work-status/work-status.service';  // Import WorkStatusService
import { Meta } from 'src/common/pagination/meta.dto';
import { StorageService } from 'src/storage/storage.service';
import { ImageTypes } from 'src/common/enum/file';
import { Response, response } from 'express';

@Injectable()
export class DailyDivisionService {
  constructor(
    @InjectRepository(DailyDivision)
    private readonly dailyDivisionRepository: Repository<DailyDivision>,
    private readonly deviceService: DeviceService,  // Inject DeviceService
    private readonly planService: PlanService,  // Inject PlanService
    private readonly userService: UserService,  // Inject UserService
    private readonly workStatusService: WorkStatusService,  // Inject WorkStatusService
    private readonly storageService: StorageService, // Inject StorageService
  ) { }

  async create(dto: CreateDailyDivisionDto): Promise<DailyDivision> {
    // Retrieve related entities
    const device = await this.deviceService.findOne(dto.deviceId);
    const plan = await this.planService.findOne(dto.planId);
    const user = await this.userService.getUserById(dto.userId);
    const workStatus = await this.workStatusService.findOne(dto.workStatusId);
    let afterImage: string[] = [];
    let beforeImage: string[] = [];
    if (dto.beforeImage) {
      beforeImage = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${device?.deviceName}/before`, dto.beforeImage)
    }
    if (dto.afterImage) {
      afterImage = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${device?.deviceName}/after`, dto.afterImage);
    }
    // Create a new DailyDivision entity
    const dailyDivision = this.dailyDivisionRepository.create({
      ...dto,
      device,
      plan,
      user,
      workStatus,
      beforeImage,
      afterImage
    });

    // Save the new DailyDivision entity to the database
    return await this.dailyDivisionRepository.save(dailyDivision);
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<DailyDivision>> {
    const [entities, itemCount] = await this.dailyDivisionRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: {
        createdAt: pagination.order
      },
      where: {

      }
    });
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<DailyDivision>(entities, meta);
  }

  async findOne(id: string): Promise<DailyDivision> {
    const dailyDivision = await this.dailyDivisionRepository.findOne({
      where: {
        id,
      }
    });
    if (!dailyDivision) {
      throw new NotFoundException('DailyDivision not found');
    }
    return dailyDivision;
  }

  async update(id: string, dto: UpdateDailyDivisionDto): Promise<DailyDivision> {
    const dailyDivision = await this.findOne(id);

    const device = await this.deviceService.findOne(dto.deviceId);
    const plan = await this.planService.findOne(dto.planId);
    const user = await this.userService.getUserById(dto.userId);
    const workStatus = await this.workStatusService.findOne(dto.workStatusId);
    dailyDivision.device = device;
    dailyDivision.plan = plan;
    dailyDivision.user = user;
    dailyDivision.workStatus = workStatus;
    const merged = this.dailyDivisionRepository.merge(dailyDivision, dto);
    return await this.dailyDivisionRepository.save(merged);
  }

  async remove(id: string): Promise<DailyDivision | Response> {
    const dailyDivision = await this.findOne(id);
    await this.dailyDivisionRepository.remove(dailyDivision);
    return response.status(200).json({
      message: 'Deleted DailyDivision successfully'
    });
  }
}
