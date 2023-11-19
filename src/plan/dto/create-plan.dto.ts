// plan.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDate, IsISO8601 } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreatePlanDto {
    @ApiProperty({ example: 'Plan contents', description: 'The contents of the plan.' })
    @IsOptional()
    @IsString()
    contents?: string;

    @ApiProperty({ example: '2023-11-20 00:00:00', description: 'The begin date of the plan.' })
    @IsISO8601()
    beginDate?: Date;

    @ApiProperty({ example: '2023-11-25 00:00:00', description: 'The end date of the plan.' })
    @IsISO8601()
    endDate?: Date;

    @ApiProperty({ example: false, required: false, description: 'Whether the plan is deleted.' })
    @IsOptional()
    @IsBoolean()
    isDelete?: boolean;


    user?: User;
}

// Add other DTOs as needed for related entities (User, DetailPlan, DailyDivision)
