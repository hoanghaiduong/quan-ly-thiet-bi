import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDate, IsISO8601, IsUUID } from 'class-validator';

export class CreateDetailPlanDto {
    @ApiProperty({ example: 1, description: 'The quantity of the detail plan.' })
    @IsNumber()
    quantity: number;

    @ApiProperty({ example: 'Unit', description: 'The unit of the detail plan.' })

    @IsString()
    unit?: string;

    @ApiProperty({ example: 'Specification', description: 'The specification of the detail plan.' })

    @IsString()
    specification?: string;

    @ApiProperty({ example: '2023-11-17', description: 'The expected date of the detail plan.' })

    @IsISO8601()
    expectedDate?: Date;

    @ApiProperty({ example: 'Notes', description: 'Additional notes for the detail plan.' })

    @IsString()
    notes?: string;

    @ApiProperty({ example: 0, description: 'The percentage of completion for the detail plan.' })
    @IsNumber()
    percents: number;

    @ApiProperty({ example: 'PM', description: 'The type of plan (PM or SM).' })
    @IsString()
    typePlan: string;

    // You might want to include validation for the relationships (Device, Plan, WorkStatus)

    // Example for Device relationship
    @ApiProperty({ description: 'Device related to the detail plan.', required: true })
    @IsUUID()
    deviceId: string;

    // Example for Plan relationship
    @ApiProperty({ description: 'Plan related to the detail plan.', required: true })
    @IsUUID()
    planId: string;

    // Example for WorkStatus relationship
    @ApiProperty({ description: 'WorkStatus related to the detail plan.', required: true })
    @IsUUID()
    workStatusId: string;
}
