// device.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDeviceDto {
    @ApiProperty({ example: 'DeviceName', description: 'The name of the device.' })
    @IsString()
    deviceName: string;

    @ApiProperty({ example: 'DeviceCode123', description: 'The code of the device.' })
    @IsString()
    code: string;

    @ApiProperty({ example: 'Red', description: 'The color of the device.' })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiProperty({ example: 'Description of the device', description: 'The descriptions of the device.' })
    @IsOptional()
    @IsString()
    descriptions?: string;

    @ApiProperty({ example: 'QRCode123', description: 'The QR code of the device.' })
    @IsOptional()
    @IsString()
    qrCode?: string;


    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false
    })
    photo?: Express.Multer.File;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true,
        required: false
    })
    images?: Express.Multer.File[];

    @ApiProperty({ example: false, required: false, description: 'Whether the device is deleted.' })
    isDeleted?: boolean;



    // For relationships, you might want to include nested DTOs for Factory, DeviceType, DetailPlan, DailyDivision

    // Example for Factory relationship
    @ApiProperty({ description: 'Factory related to the device.', required: true })
    @IsOptional()
    factoryId: string;

    // Example for DeviceType relationship
    @ApiProperty({ description: 'DeviceType related to the device.', required: true })
    @IsOptional()
    deviceTypeId: string;
}

// Add other DTOs as needed for related entities (Factory, DeviceType, DetailPlan, DailyDivision)
