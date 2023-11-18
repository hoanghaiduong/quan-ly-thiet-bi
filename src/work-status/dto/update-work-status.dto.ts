import { PartialType } from '@nestjs/swagger';
import { CreateWorkStatusDto } from './create-work-status.dto';

export class UpdateWorkStatusDto extends PartialType(CreateWorkStatusDto) {}
