import { Injectable, NotFoundException } from '@nestjs/common';
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
  async getDailyVisions(work_status_id: string) {
    const workStatus = await this.workStatusRepository.findOne({
      where: {
        id: work_status_id
      },
      relations: ['dailyVisions']
    })
    if (!workStatus) throw new NotFoundException('NOT FOUND WORK Status');
    return workStatus;
  }
}
