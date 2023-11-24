import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export enum ERelationShipDetailPlan {
    device = "device",
    factoryOfDevice = "device.factory",
    dailyDivision = "dailyDivision",
    plan = "plan",
    ALL = "ALL"
}
export enum ETypePlan {
    PM = "PM",
    CM = "CM",
}
export class QueryDetailPlanDTO {
    @ApiProperty({
        required: true
    })
    @IsUUID()
    id: string

    @ApiPropertyOptional({
        enum: ERelationShipDetailPlan,
        default: ERelationShipDetailPlan.ALL
    })
    relation: ERelationShipDetailPlan
}