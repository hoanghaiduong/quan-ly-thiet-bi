import { ApiProperty } from "@nestjs/swagger";

export class CreateBaseDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description?: string;
    @ApiProperty()
    isDeleted?: boolean;
}
