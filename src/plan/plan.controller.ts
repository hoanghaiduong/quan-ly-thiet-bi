import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Plan } from './entities/plan.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';

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

  @Get()
  async findAll(@Query() pagination: Pagination): Promise<PaginationModel<Plan>> {
    return await this.planService.findAll(pagination);
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
