import { ApiProperty } from "@nestjs/swagger";

export class QueryDateDTO {

    @ApiProperty({
        required: false
    })
    day: number;
    @ApiProperty({
        required: false
    })
    month: number;
    @ApiProperty({
        required: false
    })
    year: number;
}