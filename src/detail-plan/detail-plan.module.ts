import { Module } from '@nestjs/common';
import { DetailPlanService } from './detail-plan.service';
import { DetailPlanController } from './detail-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailPlan } from './entities/detail-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailPlan])],
  controllers: [DetailPlanController],
  providers: [DetailPlanService],
  exports: [DetailPlanService]
})
export class DetailPlanModule { }
