import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { DetailPlanService } from './detail-plan.service';
import { CreateDetailPlanDto } from './dto/create-detail-plan.dto';
import { UpdateDetailPlanDto } from './dto/update-detail-plan.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DetailPlan } from './entities/detail-plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/auth';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags("API Chi tiết kế hoạch")
@Controller('detail-plan')
@UseGuards(JwtAuthGuard)
export class DetailPlanController {
  constructor(private readonly detailPlanService: DetailPlanService) { }

  @Post('create')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The detail plan has been successfully created.' })
  async create(@Body() createDetailPlanDto: CreateDetailPlanDto, @AuthUser() user: User): Promise<DetailPlan> {
    return await this.detailPlanService.create(createDetailPlanDto, user);
  }

  @Get()
  async findAll(@Query() pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
    return await this.detailPlanService.findAll(pagination);
  }


  @Get('get-by-relations')
  async findOneWithRelation(@Query('id') id:string,@Query() pagination: Pagination): Promise<PaginationModel<DetailPlan>> {
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
