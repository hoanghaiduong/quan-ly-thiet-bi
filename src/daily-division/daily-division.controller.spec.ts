import { Test, TestingModule } from '@nestjs/testing';
import { DailyDivisionController } from './daily-division.controller';
import { DailyDivisionService } from './daily-division.service';

describe('DailyDivisionController', () => {
  let controller: DailyDivisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyDivisionController],
      providers: [DailyDivisionService],
    }).compile();

    controller = module.get<DailyDivisionController>(DailyDivisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
