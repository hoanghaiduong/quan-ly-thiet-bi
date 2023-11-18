import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DeviceTypesService } from './device-types.service';

import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/base.controller';
import { DeviceType } from './entities/device-type.entity';

@ApiTags("Loại thiết bị")
@Controller('device-types')
export class DeviceTypesController extends BaseController<DeviceType>{
  constructor(private readonly deviceTypesService: DeviceTypesService) { 
    super(deviceTypesService);
  }
  @Get('get-devices')
  async getDevices(@Query('device_type_id') deviceTypeId:string)
  {
    return await this.deviceTypesService.getDevices(deviceTypeId);
  }
}
