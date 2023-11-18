import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(OmitType(CreateDeviceDto, ['photo', 'images'])) { }
