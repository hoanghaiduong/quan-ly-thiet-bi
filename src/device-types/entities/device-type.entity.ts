import { BaseEntity } from "src/base/entities/base.entity";
import { Device } from "src/device/entities/device.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeviceType extends BaseEntity {
    @OneToMany(() => Device, device => device.deviceType, { nullable: true })
    devices: Device[]
}