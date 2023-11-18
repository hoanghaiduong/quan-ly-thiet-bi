import { ApiProperty } from "@nestjs/swagger";
import { ImageTypes } from "src/common/enum/file";

export class UpdateImageDTO {
    @ApiProperty({
        required: false
    })
    urlPhoto: string;

    @ApiProperty({
        required: false
    })
    urlImages: string[];


    @ApiProperty({
        required: false,
        type: "string",
        format: 'binary',
    })
    photo: Express.Multer.File;
    @ApiProperty({
        required: false,
        type: "string",
        format: 'binary',
        isArray: true
    })
    images: Express.Multer.File[];
}