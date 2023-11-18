import { ApiProperty } from "@nestjs/swagger";

export class BaseFileDTO {
    @ApiProperty({
        type: "string",
        format: "binary",
    })
    file: Express.Multer.File
}