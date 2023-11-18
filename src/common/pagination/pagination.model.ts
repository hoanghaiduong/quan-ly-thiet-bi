import { IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "./meta.dto";

export class PaginationModel<T> {
    @IsArray()
    @ApiProperty({ isArray: true })
    data: T[];

    @ApiProperty({ type: () => Meta })
    meta: Meta;

    constructor(data: T[], meta: Meta) {
        this.data = data;
        this.meta = meta;
    }
}
