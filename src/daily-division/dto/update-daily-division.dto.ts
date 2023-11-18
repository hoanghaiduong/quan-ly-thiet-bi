import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDailyDivisionDto } from './create-daily-division.dto';

export class UpdateDailyDivisionDto extends PartialType(OmitType(CreateDailyDivisionDto, ['afterImage', 'beforeImage'])) { }
