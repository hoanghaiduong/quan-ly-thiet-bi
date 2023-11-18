import { Injectable } from '@nestjs/common';
import { CreateWorkStatusDto } from './dto/create-work-status.dto';
import { UpdateWorkStatusDto } from './dto/update-work-status.dto';
import { BaseService } from 'src/base/base.service';
import { WorkStatus } from './entities/work-status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkStatusService extends BaseService<WorkStatus>{
  constructor(@InjectRepository(WorkStatus) private workStatusRepository: Repository<WorkStatus>) {
    super(workStatusRepository)
  }
}
