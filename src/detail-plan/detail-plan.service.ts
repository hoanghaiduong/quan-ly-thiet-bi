import { Injectable } from '@nestjs/common';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';

@Injectable()
export class DetailPlanService {
  create(createDetailPlanDto: CreateDetailPlanDto) {
    return 'This action adds a new detailPlan';
  }

  findAll() {
    return `This action returns all detailPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailPlan`;
  }

  update(id: number, updateDetailPlanDto: UpdateDetailPlanDto) {
    return `This action updates a #${id} detailPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailPlan`;
  }
}
