import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailPlanService } from './detail-plan.service';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("API Chi tiết kế hoạch")
@Controller('detail-plan')
export class DetailPlanController {
  constructor(private readonly detailPlanService: DetailPlanService) { }

  @Post()
  create(@Body() createDetailPlanDto: CreateDetailPlanDto) {
    return this.detailPlanService.create(createDetailPlanDto);
  }

  @Get()
  findAll() {
    return this.detailPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailPlanDto: UpdateDetailPlanDto) {
    return this.detailPlanService.update(+id, updateDetailPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailPlanService.remove(+id);
  }
}
