import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

enum RelationShip {
    device = "device",
    dailyDivision = "dailyDivision",
    plan = "plan",
    ALL = "ALL"
}
export class QueryDetailPlanDTO {
    @ApiProperty({
        required: true
    })
    @IsUUID()
    id: string

    @ApiPropertyOptional({
        enum: RelationShip,
        default: RelationShip.ALL
    })
    relation: RelationShip
}