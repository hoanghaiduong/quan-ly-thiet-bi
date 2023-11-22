import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ETypePlan } from "./query.dto";
import { IsEnum, IsOptional } from "class-validator";

export class QueryStatisticsDetailPlanDTO {
    @ApiPropertyOptional({
        enum: ETypePlan,
        default: ETypePlan.PM
    })
    @IsEnum(ETypePlan)
    @IsOptional()
    type?: ETypePlan = ETypePlan.PM
}