import { Controller, Get, Post, Put, Delete, Body, Query, UploadedFile } from '@nestjs/common';
import { BaseService } from './base.service';

import { BaseEntity } from './entities/base.entity';
import { UpdateBaseDto } from './dto/update-base.dto';
import { CreateBaseDto } from './dto/create-base.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { FileTypes } from 'src/common/enum/file';
import { BaseFileDTO } from './dto/base-file.dto';
import { ApiFile } from 'src/common/decorator/file.decorator';

@Controller()
export abstract class BaseController<T extends BaseEntity> {
    constructor(private readonly baseService: BaseService<T>) { }

    @Post('upload')
    @ApiFile('file', FileTypes.EXCEL)
    async uploadDataExcel(@Body() dto: BaseFileDTO, @UploadedFile() file: Express.Multer.File): Promise<any> {
        return await this.baseService.uploadDataExcel({
            ...dto,
            file: file
        });
    }
    @Get('gets')
    async findAll(@Query() pagination: Pagination): Promise<PaginationModel<T>> {
        return await this.baseService.findAll(pagination);
    }

    @Get('get')
    async findOne(@Query('id') id: string): Promise<T | undefined> {
        return this.baseService.findOne(id);
    }

    @Post('create')
    async create(@Body() createDto: CreateBaseDto): Promise<T> {
        return await this.baseService.create(createDto);
    }

    @Put('update')
    async update(@Query('id') id: string, @Body() updateDto: UpdateBaseDto): Promise<T> {
        return await this.baseService.update(id, updateDto);
    }

    @Delete('delete')
    async delete(@Query('id') id: string): Promise<Object> {
        return await this.baseService.delete(id);
    }

}
