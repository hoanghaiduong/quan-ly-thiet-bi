import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeepPartial, EntitySchema, EntityTarget, FindManyOptions, FindOneOptions, FindOptions, FindOptionsOrder, FindOptionsWhere, ILike, QueryRunner, Repository } from 'typeorm';
import { BaseEntity } from './entities/base.entity';
import { CreateBaseDto } from './dto/create-base.dto';
import { UpdateBaseDto } from './dto/update-base.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';

import * as Excel from 'exceljs'
import { BaseFileDTO } from './dto/base-file.dto';
@Injectable()
export abstract class BaseService<T extends BaseEntity> {
    constructor(private readonly repository: Repository<T>) { }

    async initialData(data: T[]): Promise<{ added: T[], skipped: string[], errors: string[] }> {

        const addedTypes: T[] = [];
        const skippedTypes: string[] = [];
        const errorMessages: string[] = [];
        const queryRunner: QueryRunner = this.repository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const entity of data) {
                const existingType = await queryRunner.manager.findOne(this.repository.target, {
                    where: {
                        name: entity.name as any,
                    },
                });
                if (!existingType) {
                    const newEntity = await queryRunner.manager.save(this.repository.target, entity);
                    addedTypes.push(newEntity);
                    Logger.error(`Added new : ${entity.name}`);
                } else {
                    skippedTypes.push(entity.name);
                    Logger.error(`Already exists: ${entity.name}`);
                }
            }

            await queryRunner.commitTransaction();
            return { added: addedTypes, skipped: skippedTypes, errors: errorMessages };
        } catch (error) {
            errorMessages.push(error.message);
            Logger.error(`Error during transaction: ${error}`);
            await queryRunner.rollbackTransaction();
            return { added: addedTypes, skipped: skippedTypes, errors: errorMessages };
        } finally {
            await queryRunner.release();
        }
    }
    async findAll(pagination: Pagination, customFilters?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<PaginationModel<T>> {

        const [entities, itemCount] = await this.repository.findAndCount({
            take: pagination.take,
            skip: pagination.skip,
            where: {
                ...customFilters,
                name: pagination.search ? ILike(`%${pagination.search}%`) as any : null
            },
            order: {
                name: pagination.order as any
            },

        });
        const meta = new Meta({ itemCount, pagination });
        return new PaginationModel<T>(entities, meta);
    }
    async findOne(id: string): Promise<T> {
        try {
            const data = await this.repository.findOne({
                where: { id: id } as any,
            });
            if (!data) {
                // Xử lý trường hợp không tìm thấy đối tượng
                throw new NotFoundException('Entity not found');
            }

            return data;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async uploadDataExcel(dto: BaseFileDTO): Promise<void | any> {
        const workbook = new Excel.Workbook();
        const filePath = dto.file;
        try {

            // Load the workbook
            await workbook.xlsx.load(filePath.buffer);

            // Get the worksheet
            const worksheet = workbook.getWorksheet(1);


            const data = [];
            const columns = {};

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    //đếm nếu dòng 1 là header thì lấy tên header
                    // Extract column names from the header row (rowNumber = 1)
                    row.eachCell((cell, colNumber) => {
                        //lặp ra mỗi ô(cell) trong dòng để lấy index và tên cột
                        columns[colNumber] = cell.value as string;
                    });
                } else {
                    //lấy các dòng bỏ header
                    // Extract data from subsequent rows and use column names from the header row
                    const rowData = {};
                    row.eachCell((cell, colNumber) => {
                        rowData[columns[colNumber]] = cell.value as string;
                    });

                    data.push({ ...rowData });
                }
            });

            const creating = this.repository.create(data);

            return await this.repository.save(creating);


        } catch (error) {
            Logger.error(error)
            throw new BadRequestException(error.message);
        }
    }

    async create(dto: CreateBaseDto): Promise<T> {
        try {
            const newEntity = this.repository.create(dto as DeepPartial<T>);
            return await this.repository.save(newEntity);

        }
        catch (error) {
            throw new BadGatewayException(error);
        }
    }

    async update(id: string, updateDto: UpdateBaseDto): Promise<T | any> {
        try {
            const entity = await this.findOne(id);

            if (!entity) {
                throw new NotFoundException('Entity not found');
            }
            return await this.repository.save({
                ...entity,
                ...updateDto
            })

            // return updatedEntity;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
    async delete(id: string): Promise<Object> {
        try {
            const find = await this.findOne(id);
            await this.repository.remove(find);
            return {
                message: `Deleted with id: ${id} successfully`
            }
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}
