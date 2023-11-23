import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsNumber, IsOptional, IsISO8601, IsUUID, Min, Max } from 'class-validator';

export class CreateDailyDivisionDto {
    // Relationships
    @ApiProperty({ example: 'example-device-id', description: 'Device related to the daily division.' })
    @IsUUID()
    deviceId: string;

    @ApiProperty({ example: 'example-detail-plan-id', description: 'Plan related to the daily division.' })
    @IsUUID()
    detailPlanId: string;

    @ApiProperty({ example: 'example-user-id', description: 'User related to the daily division.' })
    @IsUUID()
    userId: string;

    @ApiProperty({
        example: new Date(2023, 11, 20).toLocaleDateString(), description: ''
    })
    workDay?: string;

    @ApiProperty({ example: new Date().toLocaleTimeString(), description: 'Start time for the daily division.' })
    @IsString()
    startTime?: string;

    @ApiProperty({ example: new Date().toLocaleTimeString(), description: 'Estimated finish time for the daily division.' })
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
        required: false
    })
    beforeImage?: Express.Multer.File[];

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
        description: 'After images for the daily division.',
        required: false
    })
    afterImage?: Express.Multer.File[];

    @ApiProperty({ example: new Date(2023, 11, 20).toLocaleDateString(), description: '' })
    completedDate?: string;

    @ApiProperty({ example: 'example-user-id', description: 'User ID who checked the daily division.' })
    @IsUUID()
    checkedBy?: string;

    @ApiProperty({
        example: 0,
        type: 'integer',
    })
    @Min(0)
    @Max(4)
    status?: number;

    // @ApiProperty({ example: 'example-work-status-id', description: 'WorkStatus related to the daily division.' })
    // @IsString()
    // workStatusId: string;
}
