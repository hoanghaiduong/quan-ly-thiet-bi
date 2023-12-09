import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { DetailPlanService } from './detail-plan.service';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DetailPlan } from './entities/detail-plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/auth';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ERelationShipDetailPlan, QueryDetailPlanDTO } from './dto/query.dto';
import { QueryStatisticsDetailPlanDTO } from './dto/statistic-query.dto';
import { Note } from 'src/common/decorator/description.decorator';
import { QueryIdDto } from 'src/common/dto/query-id.dto';
import { EDetailPlanFilter, FilterDetailPlanDTO } from './dto/filter-detail-plan.dto';
import { CreateDetailPlanDtoByCustomer } from './dto/create-detail-plan-customer.dto';

@ApiTags("API Chi tiết kế hoạch")
@Controller('detail-plan')
@UseGuards(JwtAuthGuard)
export class DetailPlanController {
  constructor(private readonly detailPlanService: DetailPlanService) { }

  @Post('create')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The detail plan has been successfully created.' })
  async create(@Body() dto: CreateDetailPlanDto, @AuthUser() user: User): Promise<DetailPlan> {
    return await this.detailPlanService.create(dto, user.id);
  }
  @Post('report-error')
  @Roles(Role.CUSTOMER)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'API Báo lỗi thiết bị chỉ dành cho customer' })
  async reportError(@Body() dto: CreateDetailPlanDtoByCustomer, @AuthUser() user: User): Promise<DetailPlan> {
    return await this.detailPlanService.reportError(dto, user.id);
  }

  @Get('get-details-by-plan')
  async findAll(@Query() filter: FilterDetailPlanDTO, @Query() pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
    return await this.detailPlanService.findAll(filter, pagination);
  }

  
 

  @Get()
  @ApiQuery({
    enum: EDetailPlanFilter,
    name: 'column',
    required: false
  })
  async getsDetailPlan(@Query() pagination: Pagination, @Query('column') filter?: EDetailPlanFilter): Promise<PaginationModel<DetailPlan>> {
    return await this.detailPlanService.findAllDetailPlan(pagination, filter);
  }
  @Get('plant-statisctics')
  @Note("API Thống kê chi tiết kế hoạch (bao gồm kế hoạch hoàn thành , chưa hoàn thành, đang làm,phần trăm hoàn thành của những thiết bị)")
  async detailPlanStatistics(@Query() { type }: QueryStatisticsDetailPlanDTO): Promise<any> {
    return await this.detailPlanService.statisticDetailPlan(type);
  }

  @Get('get-by-relations')
  async findOneWithRelation(@Query() { id, relation }: QueryDetailPlanDTO): Promise<DetailPlan> {
    let task: any;
    if (relation === ERelationShipDetailPlan.ALL) {
      task = await this.detailPlanService.findOneWithRelationShip(id, ["dailyDivision", "device", "plan", "device.factory", "device.deviceType", "user"]);
    }
    else {
      task = await this.detailPlanService.findOneWithRelationShip(id, [relation]);
    }
    return task;
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
