import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards, Res } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Note } from 'src/common/decorator/description.decorator';
import { Response } from 'express';
import { Factory } from './entities/factory.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { async } from 'rxjs';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/auth';
import { EFactoryFilterType, FactoryFilterDTO } from './dto/factory-filter.dto';
@ApiTags("API Phân xưởng")
@Controller('factory')
@Roles(Role.ADMIN, Role.CUSTOMER)
@UseGuards(JwtAuthGuard)
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) { }

  @Note('Create a new factory')
  @ApiResponse({ status: 201, description: 'The factory has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @Post('create')
  async create(@Body() dto: CreateFactoryDto, @AuthUser() user: User): Promise<Factory> {
    return await this.factoryService.create({ ...dto, user });
  }

  @Note('Get all factories')
  @ApiResponse({ status: 200, description: 'Returns a list of all factories.' })
  @Get()
  async findAll(@Query() pagination: Pagination, @Query() filter?: FactoryFilterDTO): Promise<PaginationModel<Factory>> {
    return await this.factoryService.findAll(pagination, null, filter);
  }


  @Note('Get all factories by User')
  @ApiResponse({ status: 200, description: 'Returns a list of all factories.' })

  @Roles(Role.CUSTOMER, Role.ADMIN, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get('get-factories-by-user')
  async findAllFactoryByUser(@Query() pagination: Pagination, @AuthUser() user: User, @Query() filter?: FactoryFilterDTO): Promise<PaginationModel<Factory>> {
    return await this.factoryService.findAll(pagination, user, filter);
  }

  @ApiOperation({ summary: 'Get a factory by ID' })
  @ApiResponse({ status: 200, description: 'Returns the factory with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Factory not found.' })
  @Get('get')
  async findOne(@Query('id') id: string): Promise<Factory> {
    return await this.factoryService.findOneWithRelation(id);
  }
  @ApiOperation({ summary: 'Update a factory by ID' })
  @ApiResponse({ status: 200, description: 'The factory has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Factory not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @Patch('update')
  async update(@Query('id') id: string, @Body() factoryDto: UpdateFactoryDto): Promise<Factory> {
    return await this.factoryService.update(id, factoryDto);
  }

  @ApiOperation({ summary: 'Delete a factory by ID' })
  @ApiResponse({ status: 200, description: 'The factory has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Factory not found.' })
  @Delete('delete')
  async remove(@Query('id') id: string): Promise<Object> {
    const dto = new UpdateFactoryDto();
    dto.isDelete = true;
    await this.factoryService.update(id, dto);
    return {
      status: 200,
      messsage: "The factory delete has been successfully"
    }
  }
}
