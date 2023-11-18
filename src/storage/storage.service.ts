import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from "fs";
import * as sharp from "sharp";
import { join } from "path";
import { ImageTypes } from 'src/common/enum/file';
import { StringUtil } from 'src/common/utils/string.util';


@Injectable()
export class StorageService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService
    ) {

    }
    onModuleInit(): void {
        const path = join('.', this.configService.get<string>('FOLDER_UPLOAD'));
        console.log(path);

        if (!fs.existsSync(path)) {
            try {
                fs.mkdirSync(path, { recursive: true });
            } catch (error) {
                console.error('Error creating directory:', error);
            }
        }
    }

    // private async uploadStorage(type: ImageTypes | string, file: Express.Multer.File): Promise<string> {
    //     const patch = this.configService.get<string>("FOLDER_UPLOAD");
    //     switch (file.mimetype) {
    //         case 'image/jpeg':
    //         case 'image/png':
    //             // Xử lý cho các loại hình ảnh JPEG và PNG
    //             const imageName = await this.buildImageFileName(type, file);
    //             const imagePath = await this.buildImageFilePath(type, imageName);
    //             await sharp(file.buffer).toFile(imagePath);


    //             return imagePath.replace(/\\/g, '/').replace(patch, '/uploads/');
    //         default:

    //             // Xử lý cho các trường hợp mimetype không rơi vào các trường hợp trên
    //             const fileName = await this.buildOtherFileName(type, file.filename)
    //             const filePath = await this.buildImageFilePath(type, fileName);
    //             await sharp(filePath).toFile(filePath)
    //             return filePath.replace(/\\/g, '/').replace(patch, '/uploads/');
    //     }

    // }
    private async uploadStorage(type: ImageTypes | string, file: Express.Multer.File): Promise<string> {
        const baseUploadPath = join('public', 'uploads');

        // Kiểm tra xem thư mục gốc đã tồn tại chưa
        if (!fs.existsSync(baseUploadPath)) {
            // Nếu chưa có, tạo thư mục
            fs.mkdirSync(baseUploadPath, { recursive: true });
        }

        // Tạo thư mục con dựa trên type
        const subDirectory = type.split('/').join('/');
        const subUploadPath = join(baseUploadPath, subDirectory);
        if (!fs.existsSync(subUploadPath)) {
            fs.mkdirSync(subUploadPath, { recursive: true });
        }

        const imageName = await this.buildImageFileName(type, file);
        const imagePath = await this.buildImageFilePath(type, imageName);
        console.log(`Image ${imageName} uploaded to ${subUploadPath} with ${imagePath}`);
        await sharp(file.buffer, {
            limitInputPixels: false,

        }).toFile(imagePath);

        return imagePath.replace(/\\/g, '/').replace(/public/, '/uploads');
    }

    async uploadFile(type: ImageTypes | string, file: Express.Multer.File): Promise<string> {

        return this.uploadStorage(type, file);
    }

    async uploadMultiFiles(type: ImageTypes | string, files: Express.Multer.File[]): Promise<string[]> {
        return Promise.all(files.map((file) => this.uploadStorage(type, file)));
    }

    async deleteFile(fileName: string): Promise<void> {
        const path = join('public', fileName);
        // xoá  file
        console.log(path)
        fs.existsSync(path) && fs.unlinkSync(path);
    }



    private async buildImageFileName(type: ImageTypes | string, file: Express.Multer.File): Promise<string> {
        const extension = file.originalname.split('.').pop(); // Extract extension
        const safeType = type.replace(/[\\/]/g, '_'); // Thay thế cả \ và / bằng _
        return `${safeType}.${StringUtil.generateRandomString(12)}.${Date.now()}.${extension}`;
    }

    private async buildOtherFileName(type: ImageTypes | string, fileName: string) {
        const extension = fileName.split('.').pop();
        return `${type}.${StringUtil.generateRandomString(12)}.${Date.now()}.${extension}`;

    }
    private async buildImageFilePath(type: ImageTypes | string, fileName: string): Promise<string> {
        const patch = this.configService.get<string>("FOLDER_UPLOAD");
        const path = join('.', patch, type);
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        return join(path, fileName);
    }


    async deleteMultiFiles(images: string[]) {
        return Promise.all(images.map((image) => this.deleteFile(image)));
    }

}