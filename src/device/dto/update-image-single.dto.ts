import { ApiProperty } from "@nestjs/swagger";

export class UploadImageSingleDTO {
    @ApiProperty({
        required: false
    })
    url: string;
    @ApiProperty({
        type: 'string',
        format: 'binary',
    })
    file: Express.Multer.File;
}