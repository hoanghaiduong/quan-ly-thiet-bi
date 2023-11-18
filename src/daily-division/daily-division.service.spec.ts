import { Test, TestingModule } from '@nestjs/testing';
import { DailyDivisionService } from './daily-division.service';

describe('DailyDivisionService', () => {
  let service: DailyDivisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyDivisionService],
    }).compile();

    service = module.get<DailyDivisionService>(DailyDivisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
