import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { FactoryModule } from 'src/factory/factory.module';
import { DeviceTypesModule } from 'src/device-types/device-types.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device]),FactoryModule,DeviceTypesModule],
  controllers: [DeviceController],
  providers: [DeviceService,StorageService],
  exports: [DeviceService]
})
export class DeviceModule { }
