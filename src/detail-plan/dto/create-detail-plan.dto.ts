import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsDate, IsISO8601, IsUUID, Min, Max, IsInt } from 'class-validator';

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



    @ApiProperty({ example: new Date(2023, 11, 20).toLocaleDateString(), description: 'The expectedDate of the plan.' })
    expectedDate?: string;

    @ApiProperty({ example: 'Notes', description: 'Additional notes for the detail plan.' })

    @IsString()
    notes?: string;

    @ApiProperty({ example: 0, description: 'The percentage of completion for the detail plan.' })
    @IsNumber()
    percents: number;

    @ApiProperty({ example: 'PM', description: 'The type of plan (PM or CM).' })
    @IsString()
    typePlan: string;

    @ApiProperty({
        example: 2,
        minimum: 0,
        maximum: 4,
        type: Number
    })

    @Transform(({ value }) => parseInt(value))
    @IsInt()
    status?: number;
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
    // @ApiProperty({ description: 'WorkStatus related to the detail plan.', required: true })
    // @IsUUID()
    // workStatusId: string;
}
