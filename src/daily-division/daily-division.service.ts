import { Injectable } from '@nestjs/common';
import { CreateDailyDivisionDto } from './dto/create-daily-division.dto';
import { UpdateDailyDivisionDto } from './dto/update-daily-division.dto';

@Injectable()
export class DailyDivisionService {
  create(createDailyDivisionDto: CreateDailyDivisionDto) {
    return 'This action adds a new dailyDivision';
  }

  findAll() {
    return `This action returns all dailyDivision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyDivision`;
  }

  update(id: number, updateDailyDivisionDto: UpdateDailyDivisionDto) {
    return `This action updates a #${id} dailyDivision`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyDivision`;
  }
}
