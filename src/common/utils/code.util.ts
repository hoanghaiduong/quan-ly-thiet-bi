import { FileTypes } from "../enum/file";

export class CodeUtil {
  public static getMineType(minType: FileTypes) {
    switch (minType) {
      case FileTypes.IMAGE:
        return ['image/jpeg', 'image/png', 'image/gif']
      case FileTypes.EXCEL:
        return ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      case FileTypes.OTHER:
        return ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      default:
        return [
          'image/jpeg',
          'image/png',
          'image/gif',
        ];
    }
  }
}