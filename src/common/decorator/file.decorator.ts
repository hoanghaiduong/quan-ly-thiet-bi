import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { memoryStorage } from "multer";
import { CodeUtil } from "../utils/code.util";
import { FileTypes } from "../enum/file";




export const ApiFile = (
  fieldName: string = "file",
  minType: FileTypes = FileTypes.IMAGE
) => {
  return applyDecorators(
    //show buffer
    UseInterceptors(FileInterceptor(fieldName, {
      fileFilter: fileMimetypeFilter(CodeUtil.getMineType(minType)),
      storage: memoryStorage(),
      preservePath: true
    })),
    ApiConsumes("multipart/form-data")
  );
};
export const ApiMultipleFieldFiles = (
  fieldConfigs: {
    name: string;
    maxCount: number;
  }[] = []
) => {
  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(fieldConfigs, {
      storage: memoryStorage(),
      preservePath: true,
    })),
    ApiConsumes("multipart/form-data")
  )

};

export const ApiFiles = (
  fieldName: string = "files",
  maxCount: number = 10,
  minType: FileTypes = FileTypes.IMAGE
) => {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, {
      fileFilter: fileMimetypeFilter(CodeUtil.getMineType(minType)),
      storage: memoryStorage(),
      preservePath: true
    }
    )),
    ApiConsumes("multipart/form-data")
  );
};


export const ApiFileFields = (
  uploadFields: MulterField[],
  minType: FileTypes = FileTypes.IMAGE
) => {
  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, {
      fileFilter: fileMimetypeFilter(CodeUtil.getMineType(minType)),
      storage: memoryStorage(),
      preservePath: true
    })),
    ApiConsumes("multipart/form-data")
  );
};


export const fileMimetypeFilter = (mimetypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    console.log(file.mimetype + " " + mimetypes);
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new UnsupportedMediaTypeException("File type not supported"), false);
    }
  };
};