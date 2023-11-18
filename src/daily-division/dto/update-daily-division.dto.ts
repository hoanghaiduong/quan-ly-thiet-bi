import { PartialType } from '@nestjs/swagger';
import { CreateDailyDivisionDto } from './create-daily-division.dto';

export class UpdateDailyDivisionDto extends PartialType(CreateDailyDivisionDto) {}
