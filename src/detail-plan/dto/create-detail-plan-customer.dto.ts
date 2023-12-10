import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateDetailPlanDto } from "./create-detail-plan.dto";

export class CreateDetailPlanDtoByCustomer extends PartialType(OmitType(CreateDetailPlanDto, ['planId', 'userId', 'typePlan', 'status'])) { }