import { Module } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryController } from './factory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './entities/factory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factory])],
  controllers: [FactoryController],
  providers: [FactoryService],
  exports: [FactoryService]
})
export class FactoryModule { }
