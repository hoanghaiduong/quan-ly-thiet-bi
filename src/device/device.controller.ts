import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, UploadedFile } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Device } from './entities/device.entity';
import { ApiFile, ApiFileFields } from 'src/common/decorator/file.decorator';
import { ERelationDevices } from './Enum/query-relation.enum';
import { UpdateImageDTO } from './dto/update-image.dto';
import { FileTypes } from 'src/common/enum/file';
import { EUpdateImageDevice } from './Enum/update-image.enum';
import { UploadImageSingleDTO } from './dto/update-image-single.dto';
@ApiTags("API Thiết bị")
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) { }

  @ApiFileFields([
    {
      name: 'photo',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5
    }
  ])
  @Post('create')
  @ApiResponse({ status: 201, description: 'The device has been successfully created.' })
  async createDevice(@Body() dto: CreateDeviceDto, @UploadedFiles() files?: {
    photo?: Express.Multer.File,
    images?: Express.Multer.File[]
  }) {

    return await this.deviceService.createDevice({
      ...dto,
      photo: files?.photo?.[0],
      images: files?.images,
    });
  }

  @Get()
  async findAll(@Query() pagination: Pagination): Promise<PaginationModel<Device>> {
    return await this.deviceService.findAll(pagination);
  }

  @Get('get')
  async findOne(@Query('id') id: string): Promise<Device> {
    return await this.deviceService.findOne(id);
  }

  @Patch('update')
  async update(@Query('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    return await this.deviceService.update(id, updateDeviceDto);
  }
  @ApiFile('file', FileTypes.IMAGE)
  @ApiQuery({
    enum: EUpdateImageDevice,
    name: 'type'
  })
  @Patch('update-single-image')
  async updateSingleImage(@Query('id') id: string, @Body() dto: UploadImageSingleDTO, @UploadedFile() file: Express.Multer.File, @Query('type') type: string): Promise<Device> {
    return await this.deviceService.updateSingleImage(id, dto.url, file, type);
  }
  @Patch('update-image')
  @ApiFileFields([
    {
      name: 'photo',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5
    }
  ])
  async updateImage(@Query('id') id: string, @Body() dto: UpdateImageDTO, @UploadedFiles() files?: {
    photo?: Express.Multer.File,
    images?: Express.Multer.File[]
  }): Promise<Device> {
    return await this.deviceService.updateImage(id, {
      ...dto,
      photo: files?.photo?.[0],
      images: files?.images
    });
  }
  @Delete('delete')
  async remove(@Query('id') id: string): Promise<Device> {
    return await this.deviceService.remove(id);
  }

  @Get('get-relation')
  @ApiQuery({
    name: 'relation',
    enum: ERelationDevices
  })
  async getRelation(@Query('id') id: string, @Query('relation') relation: string): Promise<Device> {
    return await this.deviceService.getRelation(id, relation);
  }
}
