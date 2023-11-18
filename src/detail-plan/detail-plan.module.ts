import { Module } from '@nestjs/common';
import { DetailPlanService } from './detail-plan.service';
import { DetailPlanController } from './detail-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailPlan } from './entities/detail-plan.entity';
import { DeviceModule } from 'src/device/device.module';
import { PlanModule } from 'src/plan/plan.module';
import { WorkStatusModule } from 'src/work-status/work-status.module';

@Module({
  imports: [TypeOrmModule.forFeature([DetailPlan]),DeviceModule,PlanModule,WorkStatusModule],
  controllers: [DetailPlanController],
  providers: [DetailPlanService],
  exports: [DetailPlanService]
})
export class DetailPlanModule { }
