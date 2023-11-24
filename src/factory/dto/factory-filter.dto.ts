import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export enum EFactoryFilterType {
    facName = "facName",
    alias = "alias",
    address = "address",
    phone = "phone",
    phone2 = "phone2",
    user = "user",
    RoleOfUser = "RoleOfUser",
    devices = "DeviceId",
    typeOfDevice = "TypeOfDevice"
}


export class FactoryFilterDTO {
    @ApiPropertyOptional({
        enum: EFactoryFilterType,
        default: EFactoryFilterType.facName
    })
    @IsEnum(EFactoryFilterType)
    @IsOptional()
    column?: EFactoryFilterType = EFactoryFilterType.facName

}