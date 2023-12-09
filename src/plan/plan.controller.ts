import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Plan } from './entities/plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CLonePlanDTO } from './dto/clone-plan-query.dto';
import { QueryDateDTO } from 'src/common/dto/query-date.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/auth';
import { DetailPlan } from 'src/detail-plan/entities/detail-plan.entity';

@ApiTags("API Kế hoạch")
@Controller('plan')
@UseGuards(JwtAuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  @Post('create')
  @ApiResponse({ status: 201, description: 'The plan has been successfully created.' })
  async create(@Body() dto: CreatePlanDto, @AuthUser() user: User): Promise<Plan> {
    return this.planService.create({ ...dto, user });
  }

  @Post('clone-plan')
  async clonePlan(@Query() dto: CLonePlanDTO): Promise<Plan[]> {
    return await this.planService.clonePlan(dto);
  }
  @Post('clone-plan-monthly')
  async clonePlanByMonth(@Query('month') month: number, @Query('year') year: number): Promise<Plan[]> {
    return await this.planService.clonePlanByMonth(month, year);
  }
  @Post('get-plan-by-date')
  async getPlanByDate(@Query() date: QueryDateDTO): Promise<Plan> {
    return await this.planService.getPlanByDate(date);
  }
  @Get()
  @ApiQuery({
    name: 'day',
    required: false
  })
  @ApiQuery({
    name: 'month',
    required: false
  })
  @ApiQuery({
    name: 'year',
    required: false
  })

  async findAll(@Query() pagination: Pagination, @Query() date: QueryDateDTO): Promise<PaginationModel<Plan>> {
    return await this.planService.findAll(pagination, date);
  }

  @Roles(Role.CUSTOMER)
  @Get('get-detailPlans-by-customer')
  async findAllDetailPlansByCustomer(@AuthUser() user: User): Promise<DetailPlan[]> {
    return await this.planService.findAllDetailPlansByCustomer(user);
  }
  @Get('get')
  async findOne(@Query('id') id: string): Promise<Plan> {
    return await this.planService.findOne(id);
  }

  @Patch('update')
  async update(@Query('id') id: string, @Body() updatePlanDto: UpdatePlanDto): Promise<Plan> {
    return await this.planService.update(id, updatePlanDto);
  }

  @Delete('delete')
  async remove(@Query('id') id: string): Promise<Plan> {
    return await this.planService.remove(id);
  }
}
