import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/common/enum/auth";

export class CreateAuthDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
    role?: Role;
}
