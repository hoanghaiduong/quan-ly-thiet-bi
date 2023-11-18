import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Device } from './entities/device.entity';
import { ApiFileFields } from 'src/common/decorator/file.decorator';
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

  @Delete('delete')
  async remove(@Query('id') id: string): Promise<Device> {
    return await this.deviceService.remove(id);
  }
}
