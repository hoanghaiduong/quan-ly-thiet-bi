import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangePasswordDTO {
    @ApiProperty({
        description: 'Mật khẩu cũ'
    })
    @IsString()
    oldPassword: string
    @ApiProperty({
        description: 'Mật khẩu mới'
    })
    @IsString()
    newPassword: string
}