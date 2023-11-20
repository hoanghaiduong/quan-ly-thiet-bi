import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CLonePlanDTO {
    @ApiProperty()
    @IsUUID()
    planId: string;
    @ApiProperty({
        type: 'integer',
        minimum: 1,
        maximum: 999,
        description: 'Số lượng cần sao chép.',
    })
    quantity: number;
    @ApiProperty({
        example: 1,
        description: 'Số ngày tăng cho mỗi bản sao.',
    })
    daysToAdd: number;
}