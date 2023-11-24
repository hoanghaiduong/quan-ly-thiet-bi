import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
export enum EDetailPlanFilter {
    quantity = "quantity",
    unit = "unit",
    specification = "specification",
    expectedDate = "expectedDate",
    notes = "notes",
    percents = "percents",
    typePlan = "typePlan",
    status = "status",
    deviceId = "device.id",
    dailyDivision = "dailyDivision.id",
    factoryId = "device.factory"
}
export class FilterDetailPlanDTO {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    planId: string;

    @ApiPropertyOptional({
        enum: EDetailPlanFilter,
        default: EDetailPlanFilter.typePlan
    })
    @IsOptional()
    @IsEnum(EDetailPlanFilter)
    column: EDetailPlanFilter = EDetailPlanFilter.typePlan

}