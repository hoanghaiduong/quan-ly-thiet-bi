import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray } from "class-validator";
import { EUpdateImageDailyVision } from "../enum/type-update-image.enum";

export class UpdateImageDailyDivisionDTO {
    @ApiProperty({
        enum: EUpdateImageDailyVision,
        default: EUpdateImageDailyVision.after
    })
    typeImage: EUpdateImageDailyVision;

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