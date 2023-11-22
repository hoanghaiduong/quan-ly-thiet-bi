import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export enum EFilterDaily {
    detailPlan = "detailPlan",
    device = "device",
    user = "user",
    ALL = "ALL"
}
export class FilterDailyDivisionDTO {
    @ApiProperty({
        required: true
    })
    @IsUUID()
    id: string;

    @ApiPropertyOptional({
        enum: EFilterDaily,
        default: EFilterDaily.ALL
    })
    @IsEnum(EFilterDaily)
    @IsOptional()
    filter?: EFilterDaily
}