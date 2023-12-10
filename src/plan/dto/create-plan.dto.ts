// plan.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsDate, IsISO8601, Min, Max, IsInt } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreatePlanDto {
    @ApiProperty({ example: 'Plan contents', description: 'The contents of the plan.' })
    @IsOptional()
    @IsString()
    contents?: string;

    @ApiProperty({ example: new Date(2023, 11, 20).toLocaleDateString(), description: 'The begin date of the plan.' })
    // @IsISO8601()
    beginDate?: string;

    @ApiProperty({ example: new Date(2023, 11, 25).toLocaleDateString(), description: 'The end date of the plan.' })
    // @IsISO8601()
    endDate?: string;
    @ApiProperty({
        example: 2,
        minimum: 0,
        maximum: 4,
        type: Number
    })

    @Transform(({ value }) => parseInt(value))
    @IsInt()
    status?: number;
    @ApiProperty({ example: false, required: false, description: 'Whether the plan is deleted.' })
    @IsOptional()
    @IsBoolean()
    isDelete?: boolean;

    @ApiProperty({ example: false, required: false, description: 'Status cop' })
    isCopy?: boolean;

}

// Add other DTOs as needed for related entities (User, DetailPlan, DailyDivision)
