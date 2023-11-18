import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class QueryIdDto {
    //@IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}