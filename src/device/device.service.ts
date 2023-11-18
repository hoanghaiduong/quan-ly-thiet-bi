import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FactoryService } from 'src/factory/factory.service';
import { DeviceTypesService } from 'src/device-types/device-types.service';
import { StorageService } from 'src/storage/storage.service';
import { ImageTypes } from 'src/common/enum/file';
import { Meta } from 'src/common/pagination/meta.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { UpdateImageDTO } from './dto/update-image.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly factoryService: FactoryService,
    private readonly deviceTypeService: DeviceTypesService,
    private readonly storgeService: StorageService
  ) { }

  async createDevice(dto: CreateDeviceDto): Promise<Device> {
    // You may need to validate relationships and handle errors accordingly
    try {
      const { factoryId, deviceTypeId, ...deviceData } = dto;
      const [factory, deviceType] = await Promise.all([
        this.factoryService.findOne(factoryId),
        this.deviceTypeService.findOne(deviceTypeId)
      ])
      // You can replace 'factory' and 'deviceType' with the actual relationships in your entity
      let photo: string = null;
      let images: string[] = [];
      if (dto.photo) {
        photo = await this.storgeService.uploadFile(`${ImageTypes.CARD_DEVICE}/${dto.deviceName}`, dto.photo)

      }
      if (dto.images) {
        images = await this.storgeService.uploadMultiFiles(`${ImageTypes.CARD_DEVICE}/${dto.deviceName}/${ImageTypes.CARD_DEVICE_DETAIL}`, dto.images)

      }
      const device = this.deviceRepository.create({
        ...deviceData,
        factory,
        deviceType,
        photo,
        images
      });

      return await this.deviceRepository.save(device);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Device>> {
    const [entities, itemCount] = await this.deviceRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      where: {
        isDeleted: false,
        deviceName: pagination.search ? ILike(`%${pagination.search}%`) : null
      },
      order: {
        code: pagination.order
      }
    });

    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<Device>(entities, meta);
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return device;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    this.deviceRepository.merge(device, updateDeviceDto);
    return await this.deviceRepository.save(device);
  }
  async updateImage(id: string, dto: UpdateImageDTO): Promise<Device | any> {
    const device = await this.findOne(id);
    return {
      device,

    }
  }
  async remove(id: string): Promise<Device> {
    const device = await this.findOne(id);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    device.isDeleted = true;
    await this.deviceRepository.save(device);
    return device;

  }
  async getRelation(id: string, relation: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: relation === "ALL" ? ["factory", "deviceType", "detailPlans", "dailyVisions"] : [relation]
    })
    if (!device) throw new NotFoundException(`Device ${id} not found`);
    return device;
  }
}
