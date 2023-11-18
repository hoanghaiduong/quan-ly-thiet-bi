import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray } from "class-validator";
import { ImageTypes } from "src/common/enum/file";

export class UpdateImageDTO {


    @ApiProperty({
        required: false,
        type: "string",
        format: 'binary',
    })
    photo: Express.Multer.File;
    @ApiProperty({
        required: false,
    })
    @IsArray()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split(',').map((item) => item.trim()) : value,
    )
    urlImages: string[];
    @ApiProperty({
        required: false,
        type: "string",
        format: 'binary',
        isArray: true
    })
    images: Express.Multer.File[];
}