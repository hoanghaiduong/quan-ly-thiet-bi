// device.entity.ts

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DeviceType } from 'src/device-types/entities/device-type.entity';
import { Factory } from 'src/factory/entities/factory.entity';
import { DetailPlan } from 'src/detail-plan/entities/detail-plan.entity';
import { DailyDivision } from 'src/daily-division/entities/daily-division.entity';

@Entity()
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    deviceName: string;

    @Column()
    code: string;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    descriptions: string;

    @Column({ nullable: true })
    qrCode: string;

    @Column({ default: false })
    isDeleted: boolean;


    @ManyToOne(() => Factory, factories => factories, { nullable: false })
    factory: Factory;

    @ManyToOne(() => DeviceType, deviceTypes => deviceTypes, { nullable: false })
    deviceType: DeviceType;

    @OneToMany(() => DetailPlan, detailPlan => detailPlan.device, { nullable: true })
    detailPlans: DetailPlan[];

    @OneToMany(() => DailyDivision, dailyVision => dailyVision.device, { nullable: true })
    dailyVisions: DailyDivision[];
}
