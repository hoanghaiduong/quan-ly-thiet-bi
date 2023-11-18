import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { BaseService } from 'src/base/base.service';
import { DeviceType } from './entities/device-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceTypesService extends BaseService<DeviceType>{
  constructor(@InjectRepository(DeviceType) private deviceTypeRepository: Repository<DeviceType>) {
    super(deviceTypeRepository)
  }
  async onModuleInit(): Promise<void> {
    const deviceModels = [
      // { name: 'Dịch vụ tiệc trong', description: 'Dịch vụ nấu ăn và tổ chức tiệc tại nhà hàng' },
      // { name: 'Dịch vụ tiệc ngoài', description: 'Dịch vụ nấu ăn và tổ chức tiệc tại tư gia' },
    ];
    await this.initialData(deviceModels as DeviceType[]);
  }
  async findOneByName(name: string): Promise<DeviceType> {
    const businessModel = await this.deviceTypeRepository.findOne({
      where: {
        name
      }
    })
    if (!businessModel) throw new NotFoundException('Loại thiết bị không tồn tại !');
    return businessModel;
  }
}
