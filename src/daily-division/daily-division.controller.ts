import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UploadedFiles } from '@nestjs/common';
import { DailyDivisionService } from './daily-division.service';
import { CreateDailyDivisionDto } from './dto/create-daily-division.dto';
import { UpdateDailyDivisionDto } from './dto/update-daily-division.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DailyDivision } from './entities/daily-division.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiFileFields, ApiFiles } from 'src/common/decorator/file.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/auth';
import { Response } from 'express';
import { UpdateImageDailyDivisionDTO } from './dto/update-image.dto';
import { FilterDailyDivisionDTO } from './dto/query-filter.dto';
@ApiTags("API Phân công hằng ngày")
@Controller('daily-division')
@UseGuards(JwtAuthGuard)
export class DailyDivisionController {
  constructor(private readonly dailyDivisionService: DailyDivisionService) { }
  @Post('create')
  @Roles(Role.TECHNICAL, Role.ADMIN)
  @ApiFileFields([
    {
      name: 'beforeImage',
      maxCount: 5,
    },
    {
      name: 'afterImage',
      maxCount: 5
    }
  ])
  @ApiResponse({ status: 201, description: 'The daily division has been successfully created.' })
  async create(@Body() dto: CreateDailyDivisionDto, @UploadedFiles() files?: {
    beforeImage: Express.Multer.File[],
    afterImage: Express.Multer.File[]
  }): Promise<DailyDivision> {
    return await this.dailyDivisionService.create({
      ...dto,
      beforeImage: files?.beforeImage,
      afterImage: files?.afterImage,
    });
  }

  @Get()
  async findAll(@Query() pagination: Pagination): Promise<PaginationModel<DailyDivision>> {
    return await this.dailyDivisionService.findAll(pagination);
  }

  @Get('get')
  async findOne(@Query('id') id: string): Promise<DailyDivision> {
    return await this.dailyDivisionService.findOne(id);
  }
  @Get('get-one-relations')
  async findOneWithRelation(@Query() { id, filter }: FilterDailyDivisionDTO): Promise<DailyDivision> {
    return await this.dailyDivisionService.findOneRelationControllerCustom(id,filter);
  }
  @Patch('update')
  async update(@Query('id') id: string, @Body() updateDailyDivisionDto: UpdateDailyDivisionDto): Promise<DailyDivision> {
    return await this.dailyDivisionService.update(id, updateDailyDivisionDto);
  }

  @Patch('update-image')
  @ApiFiles('images', 5)
  async updateImage(@Query('id') id: string, @Body() dto: UpdateImageDailyDivisionDTO, @UploadedFiles() files?: Express.Multer.File[]): Promise<DailyDivision | any> {
    return await this.dailyDivisionService.updateImage(id, {
      ...dto,
      images: files ?? null
    });
  }


  @Delete('delete')
  async remove(@Query('id') id: string): Promise<DailyDivision | Response> {
    return await this.dailyDivisionService.remove(id);
  }
}
