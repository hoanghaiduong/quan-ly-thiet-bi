import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

export const Note = (description: string) => {
    return applyDecorators(
        SetMetadata("description", description),
        ApiOperation({ summary: description }),
    );
};
