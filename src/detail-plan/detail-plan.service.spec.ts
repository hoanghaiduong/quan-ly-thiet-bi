import { Test, TestingModule } from '@nestjs/testing';
import { DetailPlanService } from './detail-plan.service';

describe('DetailPlanService', () => {
  let service: DetailPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailPlanService],
    }).compile();

    service = module.get<DetailPlanService>(DetailPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
