import { Module } from '@nestjs/common';
import { DailyDivisionService } from './daily-division.service';
import { DailyDivisionController } from './daily-division.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyDivision } from './entities/daily-division.entity';
import { WorkStatusModule } from 'src/work-status/work-status.module';
import { PlanModule } from 'src/plan/plan.module';
import { UserModule } from 'src/user/user.module';
import { StorageService } from 'src/storage/storage.service';
import { DeviceModule } from 'src/device/device.module';
import { DetailPlanModule } from 'src/detail-plan/detail-plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([DailyDivision]), WorkStatusModule, DetailPlanModule, UserModule, DeviceModule],
  controllers: [DailyDivisionController],
  providers: [DailyDivisionService, StorageService],
  exports: [DailyDivisionService]

})
export class DailyDivisionModule { }
