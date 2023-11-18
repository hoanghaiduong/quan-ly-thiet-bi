import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsNumber, IsOptional, IsISO8601, IsUUID } from 'class-validator';

export class CreateDailyDivisionDto {
    @ApiProperty({ description: 'Work day for the daily division.', required: false })
    @IsISO8601()
    workDay?: Date;

    @ApiProperty({ description: 'Start time for the daily division.', required: false })
    @IsString()
    startTime?: string;

    @ApiProperty({ description: 'Estimated finish time for the daily division.', required: false })
    @IsString()
    estimateFinishTime?: string;

    @ApiProperty({ description: 'Total time for the daily division.', required: false })

    totalTime?: number;

    @ApiProperty({ description: 'Specific contents for the daily division.', required: false })
    @IsString()
    specificContents?: string;

    @ApiProperty({ description: 'Quantity for the daily division.', default: 1 })

    quantity?: number;

    @ApiProperty({ description: 'Reason for the daily division.', required: false })
    @IsString()
    reason?: string;

    @ApiProperty({ description: 'Job description for the daily division.', required: false })
    @IsString()
    jobDescription?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true
    })
    beforeImage?: Express.Multer.File[];

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true
    })

    afterImage?: Express.Multer.File[];

    @ApiProperty({ description: 'Date when the division is completed.', required: false })
    @IsISO8601()
    completedDate?: Date;

    @ApiProperty({ description: 'User ID who checked the daily division.', required: false })
    checkedBy?: string;

    // Relationships
    @ApiProperty({ description: 'Device related to the daily division.', required: true })
    @IsString()
    deviceId: string;

    @ApiProperty({ description: 'Plan related to the daily division.', required: true })
    @IsString()
    planId: string;

    @ApiProperty({ description: 'User related to the daily division.', required: true })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'WorkStatus related to the daily division.', required: true })
    @IsString()
    workStatusId: string;
}
