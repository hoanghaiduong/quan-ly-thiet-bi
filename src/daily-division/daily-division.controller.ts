import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyDivisionService } from './daily-division.service';
import { CreateDailyDivisionDto } from './dto/create-daily-division.dto';
import { UpdateDailyDivisionDto } from './dto/update-daily-division.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("API Phân công hằng ngày")
@Controller('daily-division')
export class DailyDivisionController {
  constructor(private readonly dailyDivisionService: DailyDivisionService) { }

  @Post()
  create(@Body() createDailyDivisionDto: CreateDailyDivisionDto) {
    return this.dailyDivisionService.create(createDailyDivisionDto);
  }

  @Get()
  findAll() {
    return this.dailyDivisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyDivisionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyDivisionDto: UpdateDailyDivisionDto) {
    return this.dailyDivisionService.update(+id, updateDailyDivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyDivisionService.remove(+id);
  }
}
