import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WorkStatusService } from './work-status.service';
import { CreateWorkStatusDto } from './dto/create-work-status.dto';
import { UpdateWorkStatusDto } from './dto/update-work-status.dto';
import { BaseController } from 'src/base/base.controller';
import { WorkStatus } from './entities/work-status.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('work-status')
@ApiTags("API Trạng thái công việc")
export class WorkStatusController extends BaseController<WorkStatus>{
  constructor(private readonly workStatusService: WorkStatusService) {
    super(workStatusService);
  }
  @Get('get-dailyvision-work')
  async getDailyVision(@Query('work_status_id') work_status_id: string) {
    return await this.workStatusService.getDailyVisions(work_status_id);
  }

}
