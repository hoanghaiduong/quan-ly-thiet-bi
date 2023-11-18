import { ApiProperty } from "@nestjs/swagger";

export class CreateBaseDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description?: string;
    @ApiProperty({
        default: false,
        nullable: true
    })
    isDeleted?: boolean;
}
