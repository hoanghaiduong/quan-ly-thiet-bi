import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateDailyDivisionDto } from './dto/create-daily-division.dto';
import { UpdateDailyDivisionDto } from './dto/update-daily-division.dto';
import { DailyDivision } from './entities/daily-division.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { DeviceService } from 'src/device/device.service';  // Import DeviceService
import { PlanService } from 'src/plan/plan.service';  // Import PlanService
import { UserService } from 'src/user/user.service';  // Import UserService
import { WorkStatusService } from 'src/work-status/work-status.service';  // Import WorkStatusService
import { Meta } from 'src/common/pagination/meta.dto';
import { StorageService } from 'src/storage/storage.service';
import { ImageTypes } from 'src/common/enum/file';
import { Response, response } from 'express';
import { EUpdateImageDailyVision } from './enum/type-update-image.enum';
import { UpdateImageDailyDivisionDTO } from './dto/update-image.dto';
import { isArray } from 'util';
import { arrayNotEmpty } from 'class-validator';
import { Transactional, runOnTransactionRollback } from 'typeorm-transactional';
import { DetailPlanService } from 'src/detail-plan/detail-plan.service';
import { EFilterDaily } from './dto/query-filter.dto';

type relationshipType =
  'device' | 'detailPlan' | 'user'
@Injectable()
export class DailyDivisionService {

  constructor(
    @InjectRepository(DailyDivision)
    private readonly dailyDivisionRepository: Repository<DailyDivision>,
    private readonly deviceService: DeviceService,  // Inject DeviceService
    private readonly detailPlanService: DetailPlanService,  // Inject PlanService
    private readonly userService: UserService,  // Inject UserService
    private readonly workStatusService: WorkStatusService,  // Inject WorkStatusService
    private readonly storageService: StorageService, // Inject StorageService
  ) { }

  async create(dto: CreateDailyDivisionDto): Promise<DailyDivision | any> {
    let imagesToDelete: string[] = [];
    try {
      // Retrieve related entities
      const device = await this.deviceService.findOne(dto.deviceId);
      const detailPlan = await this.detailPlanService.findOne(dto.detailPlanId);
      const users = await this.userService.findByIds(dto.userIds);

      let afterImage: string[] = [];
      let beforeImage: string[] = [];
      if (dto.beforeImage) {
        beforeImage = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${device?.deviceName}/${EUpdateImageDailyVision.before}`, dto.beforeImage)
      }
      if (dto.afterImage) {
        afterImage = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${device?.deviceName}/${EUpdateImageDailyVision.after}`, dto.afterImage);
      }

      imagesToDelete.push(...afterImage, ...beforeImage);
      // Create a new DailyDivision entity
      const dailyDivision = this.dailyDivisionRepository.create({
        ...dto,
        device,
        detailPlan,
        users,
        beforeImage,
        afterImage
      });

      // Save the new DailyDivision entity to the database
      return await this.dailyDivisionRepository.save(dailyDivision);
    } catch (error) {
      await this.storageService.deleteMultiFiles(imagesToDelete);
      throw new BadRequestException(error.message)
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<DailyDivision>> {
    const [entities, itemCount] = await this.dailyDivisionRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: {
        createdAt: pagination.order
      },
      relations: [
        'device', 'detailPlan', 'user'
      ]
    });
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<DailyDivision>(entities, meta);
  }
  async findOne(id: string): Promise<DailyDivision> {
    const dailyDivision = await this.dailyDivisionRepository.findOne({
      where: {
        id,
      }
    });
    if (!dailyDivision) {
      throw new NotFoundException('DailyDivision not found');
    }
    return dailyDivision;
  }
  async findOneRelationShip(id: string, relations?: relationshipType[]): Promise<DailyDivision> {
    const dailyDivision = await this.dailyDivisionRepository.findOne({
      where: {
        id,
      },
      relations: relations
    });
    if (!dailyDivision) {
      throw new NotFoundException('DailyDivision not found');
    }
    return dailyDivision;
  }
  async findOneRelationControllerCustom(id: string, relation: EFilterDaily): Promise<DailyDivision> {
    let dailyDivision: DailyDivision = null;
    if (relation === EFilterDaily.ALL) {
      dailyDivision = await this.findOneRelationShip(id, ["detailPlan", "device", "user"])
    }
    else {
      dailyDivision = await this.findOneRelationShip(id, [relation])
    }
    return dailyDivision;
  }
  async update(id: string, dto: UpdateDailyDivisionDto): Promise<DailyDivision> {
    const dailyDivision = await this.findOne(id);

    const device = await this.deviceService.findOne(dto.deviceId);
    const detailPlan = await this.detailPlanService.findOne(dto.detailPlanId);
    const users = await this.userService.findByIds(dto.userIds);

    await this.userService.getUserById(dto.checkedBy);
    dailyDivision.device = device;
    dailyDivision.detailPlan = detailPlan;
    dailyDivision.users = users;
    const merged = this.dailyDivisionRepository.merge(dailyDivision, dto);
    return await this.dailyDivisionRepository.save(merged);
  }
  // @Transactional()
  // async updateImage(id: string, dto: UpdateImageDailyDivisionDTO): Promise<DailyDivision | any> {
  //   try {

  //     const dailyDivision = await this.findOneRelationShip(id, ["device"]);
  //     const validUrlImages = dto?.urlImages?.filter((url) => typeof url === 'string' && url.trim() !== '');

  //     if (dto.typeImage === EUpdateImageDailyVision.after) {
  //       if (arrayNotEmpty(validUrlImages) && arrayNotEmpty(dto.images)) {
  //         const imagesToDelete = dailyDivision.afterImage.filter(oldImage => dto.urlImages.includes(oldImage));
  //         const deletePromises: Promise<void>[] = imagesToDelete.map(oldImage => this.storageService.deleteFile(oldImage));
  //         await Promise.all(deletePromises);

  //         // Update  images excluding the ones to be deleted
  //         dailyDivision.afterImage = dailyDivision.afterImage.filter(oldImage => !imagesToDelete.includes(oldImage));

  //         const newImages = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision.device?.deviceName}/${EUpdateImageDailyVision.after}`, dto.images);
  //         // Update  images with the new ones
  //         dailyDivision.afterImage = [...dailyDivision.afterImage, ...newImages];
  //       }
  //       else if (arrayNotEmpty(dto.images) && !arrayNotEmpty(validUrlImages)) {
  //       {
  //           //nếu chỉ truyền images
  //         //upload ảnh mới
  //         if (dailyDivision.afterImage === null) {
  //           const newImages = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision?.device?.deviceName}/${EUpdateImageDailyVision.after}`, dto.images);
  //           dailyDivision.afterImage = newImages;
  //         }
  //         else {
  //           const newImages = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision?.device?.deviceName}/${EUpdateImageDailyVision.after}`, dto.images);
  //           dailyDivision.afterImage = [...dailyDivision.afterImage, ...newImages];
  //         }
  //       }
  //       else if (arrayNotEmpty(validUrlImages) && !arrayNotEmpty(dto.images)) {

  //         const imagesToDelete = dailyDivision?.afterImage?.filter(oldImage => dto.urlImages.includes(oldImage));
  //         const deletePromises: Promise<void>[] = imagesToDelete.map(oldImage => this.storageService.deleteFile(oldImage));
  //         await Promise.all(deletePromises);
  //         dailyDivision.afterImage = dailyDivision?.afterImage?.filter(oldImage => !imagesToDelete.includes(oldImage));//cập nhật lại trong cơ sở dữ liệu
  //         // còn lại nếu truyền dto url cũ và không truyền dto images thì xoá đi
  //       }


  //     }
  //     else if (dto.typeImage === EUpdateImageDailyVision.before) {
  //       if (arrayNotEmpty(dto.images) && arrayNotEmpty(validUrlImages)) {
  //         //nếu truyền cả url ảnh cũ và truyền cả ảnh mới

  //         const imagesToDelete = dailyDivision?.beforeImage?.filter(oldImage => dto.urlImages.includes(oldImage));
  //         const deletePromises: Promise<void>[] = imagesToDelete.map(oldImage => this.storageService.deleteFile(oldImage));
  //         await Promise.all(deletePromises);

  //         // Update device images excluding the ones to be deleted
  //         dailyDivision.beforeImage = dailyDivision?.beforeImage?.filter(oldImage => !imagesToDelete.includes(oldImage));
  //         const newImages = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision.device?.deviceName}/${EUpdateImageDailyVision.before}`, dto.images);
  //         // Update  images with the new ones
  //         dailyDivision.beforeImage = [...dailyDivision.beforeImage, ...newImages];

  //       }
  //       else if (arrayNotEmpty(dto.images) && !arrayNotEmpty(validUrlImages)) {
  //         //nếu chỉ truyền images
  //         //upload ảnh mới
  //         if (dailyDivision.beforeImage === null) {
  //           const newImages = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision?.device?.deviceName}/${EUpdateImageDailyVision.before}`, dto.images);
  //           dailyDivision.beforeImage = newImages;
  //         }
  //         else {
  //           const newImages = await this.storageService.uploadMultiFiles(`${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision?.device?.deviceName}/${EUpdateImageDailyVision.before}`, dto.images);
  //           dailyDivision.beforeImage = [...dailyDivision.beforeImage, ...newImages];
  //         }
  //       }
  //       else if (arrayNotEmpty(validUrlImages) && !arrayNotEmpty(dto.images)) {

  //         const imagesToDelete = dailyDivision?.beforeImage?.filter(oldImage => dto.urlImages.includes(oldImage));
  //         const deletePromises: Promise<void>[] = imagesToDelete.map(oldImage => this.storageService.deleteFile(oldImage));
  //         await Promise.all(deletePromises);
  //         dailyDivision.beforeImage = dailyDivision?.beforeImage?.filter(oldImage => !imagesToDelete.includes(oldImage));//cập nhật lại trong cơ sở dữ liệu
  //         // còn lại nếu truyền dto url cũ và không truyền dto images thì xoá đi
  //       }

  //     }
  //     return await this.dailyDivisionRepository.save(dailyDivision);
  //   } catch (error) {

  //     throw new BadRequestException(error.message);
  //   }
  // }

  private async deleteFilesAndRemoveFromArray(imageArray: string[], urlsToDelete: string[]): Promise<string[]> {
    const imagesToDelete = imageArray.filter((oldImage) => urlsToDelete.includes(oldImage));
    const deletePromises: Promise<void>[] = imagesToDelete.map((oldImage) =>
      this.storageService.deleteFile(oldImage)
    );
    await Promise.all(deletePromises);
    return imageArray.filter((oldImage) => !imagesToDelete.includes(oldImage));
  };
  async updateImage(id: string, dto: UpdateImageDailyDivisionDTO): Promise<DailyDivision | any> {
    const queryRunner: QueryRunner = this.dailyDivisionRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dailyDivision = await this.findOneRelationShip(id, ['device']);
      const validUrlImages = dto?.urlImages?.filter((url) => typeof url === 'string' && url.trim() !== '');


      if (dto.typeImage === EUpdateImageDailyVision.after) {
        if (arrayNotEmpty(validUrlImages) && arrayNotEmpty(dto.images)) {
          dailyDivision.afterImage = (await this.deleteFilesAndRemoveFromArray(
            dailyDivision.afterImage,
            dto.urlImages
          ));
          const newImages = await this.storageService.uploadMultiFiles(
            `${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision.device?.deviceName}/${EUpdateImageDailyVision.after}`,
            dto.images
          );
          dailyDivision.afterImage = [...dailyDivision.afterImage, ...newImages];
        } else if (arrayNotEmpty(dto.images) && !arrayNotEmpty(validUrlImages)) {
          dailyDivision.afterImage = arrayNotEmpty(dailyDivision.afterImage)
            ? (await this.deleteFilesAndRemoveFromArray(dailyDivision.afterImage, []))
            : [];
          const newImages = await this.storageService.uploadMultiFiles(
            `${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision.device?.deviceName}/${EUpdateImageDailyVision.after}`,
            dto.images
          );
          dailyDivision.afterImage = [...dailyDivision.afterImage, ...newImages];
        } else if (arrayNotEmpty(validUrlImages) && !arrayNotEmpty(dto.images)) {
          dailyDivision.afterImage = (await this.deleteFilesAndRemoveFromArray(
            dailyDivision.afterImage,
            dto.urlImages
          ));
        }
      } else if (dto.typeImage === EUpdateImageDailyVision.before) {
        if (arrayNotEmpty(validUrlImages) && arrayNotEmpty(dto.images)) {
          dailyDivision.beforeImage = (await this.deleteFilesAndRemoveFromArray(
            dailyDivision.beforeImage,
            dto.urlImages
          ));
          const newImages = await this.storageService.uploadMultiFiles(
            `${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision.device?.deviceName}/${EUpdateImageDailyVision.before}`,
            dto.images
          );
          dailyDivision.beforeImage = [...dailyDivision.beforeImage, ...newImages];
        } else if (arrayNotEmpty(dto.images) && !arrayNotEmpty(validUrlImages)) {
          dailyDivision.beforeImage = arrayNotEmpty(dailyDivision.beforeImage)
            ? (await this.deleteFilesAndRemoveFromArray(dailyDivision.beforeImage, []))
            : [];
          const newImages = await this.storageService.uploadMultiFiles(
            `${ImageTypes.CARD_DAILY_DIVISION}/${ImageTypes.CARD_DAILY_DIVISION_DETAIL}/${dailyDivision.device?.deviceName}/${EUpdateImageDailyVision.before}`,
            dto.images
          );
          dailyDivision.beforeImage = [...dailyDivision.beforeImage, ...newImages];
        } else if (arrayNotEmpty(validUrlImages) && !arrayNotEmpty(dto.images)) {
          dailyDivision.beforeImage = (await this.deleteFilesAndRemoveFromArray(
            dailyDivision.beforeImage,
            dto.urlImages
          ));
        }
      }
      await queryRunner.commitTransaction();
      return await this.dailyDivisionRepository.save(dailyDivision);
    } catch (error) {
      Logger.error(`Error during transaction: ${error}`);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }

  }

  async remove(id: string): Promise<DailyDivision | Response> {
    const dailyDivision = await this.findOne(id);
    await this.dailyDivisionRepository.remove(dailyDivision);
    return response.status(200).json({
      message: 'Deleted DailyDivision successfully'
    });
  }
}
