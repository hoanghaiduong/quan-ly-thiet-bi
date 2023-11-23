import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

export class CreateNotificationDto {

    @ApiProperty({
        required: true
    })
    title: string;
    @ApiProperty({
        required: true
    })
    message: string;
    @ApiProperty({
        required: false
    })

    type: number;
    @ApiProperty({
        required: false
    })
    status: boolean;
    @ApiProperty({
        required: true
    })
    userId: string;
}
