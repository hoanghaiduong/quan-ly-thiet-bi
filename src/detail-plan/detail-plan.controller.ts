import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { DetailPlanService } from './detail-plan.service';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DetailPlan } from './entities/detail-plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';

@ApiTags("API Chi tiết kế hoạch")
@Controller('detail-plan')
export class DetailPlanController {
  constructor(private readonly detailPlanService: DetailPlanService) { }

  @Post('create')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The detail plan has been successfully created.' })
  async create(@Body() createDetailPlanDto: CreateDetailPlanDto): Promise<DetailPlan> {
    return await this.detailPlanService.create(createDetailPlanDto);
  }

  @Get()
  async findAll(@Query() pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
    return await this.detailPlanService.findAll(pagination);
  }

  @Get('get')
  async findOne(@Query('id') id: string): Promise<DetailPlan> {
    return await this.detailPlanService.findOne(id);
  }

  @Patch('update')
  async update(@Query('id') id: string, @Body() updateDetailPlanDto: UpdateDetailPlanDto): Promise<DetailPlan> {
    return await this.detailPlanService.update(id, updateDetailPlanDto);
  }

  @Delete('delete')
  async remove(@Query('id') id: string): Promise<DetailPlan> {
    return await this.detailPlanService.remove(id);
  }
}
