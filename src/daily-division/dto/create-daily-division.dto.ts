import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsNumber, IsOptional, IsISO8601, IsUUID } from 'class-validator';

export class CreateDailyDivisionDto {
    @ApiProperty({ example: '2023-11-17 00:00:00', description: 'Work day for the daily division.' })
    @IsISO8601()
    workDay?: Date;

    @ApiProperty({ example: '2023-11-17 00:00:00', description: 'Start time for the daily division.' })
    @IsString()
    startTime?: string;

    @ApiProperty({ example: '2023-11-17 00:00:00', description: 'Estimated finish time for the daily division.' })
    @IsString()
    estimateFinishTime?: string;

    @ApiProperty({ example: 8.5, description: 'Total time for the daily division.' })
    totalTime?: number;

    @ApiProperty({ example: 'Example specific contents', description: 'Specific contents for the daily division.' })
    @IsString()
    specificContents?: string;

    @ApiProperty({ example: 2, description: 'Quantity for the daily division.', default: 1 })
    quantity?: number;

    @ApiProperty({ example: 'Example reason', description: 'Reason for the daily division.' })
    @IsString()
    reason?: string;

    @ApiProperty({ example: 'Example job description', description: 'Job description for the daily division.' })
    @IsString()
    jobDescription?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
        description: 'Before images for the daily division.',
    })
    beforeImage?: Express.Multer.File[];

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
        description: 'After images for the daily division.',
    })
    afterImage?: Express.Multer.File[];

    @ApiProperty({ example: '2023-11-18', description: 'Date when the division is completed.' })
    @IsISO8601()
    completedDate?: Date;

    @ApiProperty({ example: 'example-user-id', description: 'User ID who checked the daily division.' })
    @IsUUID()
    checkedBy?: string;

    // Relationships
    @ApiProperty({ example: 'example-device-id', description: 'Device related to the daily division.' })
    @IsUUID()
    deviceId: string;

    @ApiProperty({ example: 'example-plan-id', description: 'Plan related to the daily division.' })
    @IsUUID()
    planId: string;

    @ApiProperty({ example: 'example-user-id', description: 'User related to the daily division.' })
    @IsUUID()
    userId: string;

    @ApiProperty({ example: 'example-work-status-id', description: 'WorkStatus related to the daily division.' })
    @IsString()
    workStatusId: string;
}
