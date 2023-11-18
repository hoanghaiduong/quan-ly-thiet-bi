import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreateFactoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    facName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    alias?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone2?: string;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isDelete?: boolean;

    user?: User;
}
