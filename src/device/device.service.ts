import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
      },
      loadRelationIds: true
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

  async update(id: string, dto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    const [factory, deviceType] = await Promise.all([
      this.factoryService.findOne(dto.factoryId),
      this.deviceTypeService.findOne(dto.deviceTypeId)
    ])
    device.factory = factory;
    device.deviceType = deviceType;
    this.deviceRepository.merge(device, dto);
    return await this.deviceRepository.save(device);
  }

  // async updateImage(id: string, dto: UpdateImageDTO): Promise<Device | any> {
  //   const device = await this.findOne(id);

  //   // Delete old photo

  //   if (dto.photo) {
  //     if (device.photo !== null) {
  //       await this.storgeService.deleteFile(device.photo);
  //       device.photo = await this.storgeService.uploadFile(`${ImageTypes.CARD_DEVICE}/${device.deviceName}`, dto.photo);

  //     }
  //     else {
  //       device.photo = await this.storgeService.uploadFile(`${ImageTypes.CARD_DEVICE}/${device.deviceName}`, dto.photo);

  //     }
  //   }

  //   const arrTemp: string[] = [];
  //   const arrTemp2: string[] = [];
  //   const deletePromises: Promise<void>[] = [];

  //   if (dto.urlImages && dto.urlImages[0] !== "") {
  //     //nếu có truyền mảng url ảnh cũ thì tìm kiếm ảnh đó xoá đi và thay bằng ảnh mới nếu có truyền dto.images
  //     if (dto.images) {
  //       for (const oldImage of device.images) {
  //         if (dto.urlImages.includes(oldImage)) {
  //           arrTemp.push(oldImage);
  //           deletePromises.push(this.storgeService.deleteFile(oldImage));
  //         }
  //       }
  //       Logger.debug("Các ảnh sẽ xoá nếu có truyền mảng url images cũ và mảnh ảnh mới", arrTemp);
  //       await Promise.all(deletePromises);
  //       //sau khi xoá xong upload ảnh mới
  //       const templ = await this.storgeService.uploadMultiFiles(`${ImageTypes.CARD_DEVICE}/${device.deviceName}/${ImageTypes.CARD_DEVICE_DETAIL}`, dto.images);
  //       for (const temp of templ) {
  //         device.images.push(temp);
  //       }
  //     }




  //   }
  //   else {

  //     if (dto.images) {
  //       for (const oldImage of device.images) {
  //         deletePromises.push(this.storgeService.deleteFile(oldImage));
  //       }
  //       Logger.debug("Các ảnh sẽ xoá nếu chưa có truyền url images", deletePromises);
  //       await Promise.all(deletePromises);
  //       device.images = await this.storgeService.uploadMultiFiles(`${ImageTypes.CARD_DEVICE}/${device.deviceName}/${ImageTypes.CARD_DEVICE_DETAIL}`, dto.images);
  //     }


  //   }

  //   // await Promise.all(deletePromises);
  //   // Delete old images not included in the updated ones
  //   // if (dto.urlImages) {//nếu có truyền ảnh muốn cập nhật
  //   //   // Upload new images if provided
  //   //   const imagesToDelete = device.images.filter(oldImage => !dto.urlImages.includes(oldImage));
  //   //   Logger.debug("Các ảnh sẽ xoá", imagesToDelete);
  //   //   const deletePromises = imagesToDelete.map(oldImage => this.storgeService.deleteFile(oldImage));
  //   //   await Promise.all(deletePromises);
  //   // }






  //   // Save the updated device
  //   return await this.deviceRepository.save(device);
  // }
  async updateSingleImage(id: string, url: string, newFile: Express.Multer.File, type: string): Promise<Device | any> {
    try {
      const device = await this.findOne(id);
      if (url) {
        await this.storgeService.deleteFile(url);
      }
      let savedImage: any;
      if (type === "photo") {
        savedImage = await this.storgeService.uploadFile(`${ImageTypes.CARD_DEVICE}/${device.deviceName}`, newFile);
      }
      else {
        savedImage = await this.storgeService.uploadFile(`${ImageTypes.CARD_DEVICE}/${device.deviceName}/${ImageTypes.CARD_DEVICE_DETAIL}`, newFile);
      }



      return savedImage;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async updateImage(id: string, dto: UpdateImageDTO): Promise<Device | any> {
    const device = await this.findOne(id);

    // Delete old photo
    if (dto.photo) {
      if (device.photo !== null) {
        await this.storgeService.deleteFile(device.photo);
      }
      device.photo = await this.storgeService.uploadFile(`${ImageTypes.CARD_DEVICE}/${device.deviceName}`, dto.photo);
    }

    // Delete old images based on provided URL images
    if (dto.urlImages && dto.urlImages.length > 0) {
      const imagesToDelete = device.images.filter(oldImage => dto.urlImages.includes(oldImage));
      const deletePromises: Promise<void>[] = imagesToDelete.map(oldImage => this.storgeService.deleteFile(oldImage));
      await Promise.all(deletePromises);

      // Update device images excluding the ones to be deleted
      device.images = device.images.filter(oldImage => !imagesToDelete.includes(oldImage));
    }

    // Upload new images
    if (dto.images && dto.images.length > 0) {
      const newImages = await this.storgeService.uploadMultiFiles(`${ImageTypes.CARD_DEVICE}/${device.deviceName}/${ImageTypes.CARD_DEVICE_DETAIL}`, dto.images);

      // Update device images with the new ones
      device.images = [...device.images, ...newImages];
    }

    // Save the updated device
    return await this.deviceRepository.save(device);
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
