import { Module } from '@nestjs/common';
import { DailyDivisionService } from './daily-division.service';
import { DailyDivisionController } from './daily-division.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyDivision } from './entities/daily-division.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyDivision])],
  controllers: [DailyDivisionController],
  providers: [DailyDivisionService],
  exports: [DailyDivisionService]

})
export class DailyDivisionModule { }
