import { Test, TestingModule } from '@nestjs/testing';
import { DetailPlanController } from './detail-plan.controller';
import { DetailPlanService } from './detail-plan.service';

describe('DetailPlanController', () => {
  let controller: DetailPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailPlanController],
      providers: [DetailPlanService],
    }).compile();

    controller = module.get<DetailPlanController>(DetailPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
