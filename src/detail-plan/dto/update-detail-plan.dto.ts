import { PartialType } from '@nestjs/swagger';
import { CreateDetailPlanDto } from './create-detail-plan.dto';

export class UpdateDetailPlanDto extends PartialType(CreateDetailPlanDto) {}
