// device.entity.ts

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import { DeviceType } from 'src/device-types/entities/device-type.entity';
import { Factory } from 'src/factory/entities/factory.entity';
import { DetailPlan } from 'src/detail-plan/entities/detail-plan.entity';
import { DailyDivision } from 'src/daily-division/entities/daily-division.entity';

@Entity()
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    deviceName: string;

    @Column({
        nullable: true
    })
    photo: string;

    @Column({
        nullable: true
    })
    location: string;

    @Column({
        type: 'text',
        array: true,
        nullable: true
    })
    images: string[];
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


    @ManyToOne(() => Factory, factories => factories, { nullable: false  })
    factory: Factory;

    @ManyToOne(() => DeviceType, deviceTypes => deviceTypes, { nullable: false })
    deviceType: DeviceType;

    @OneToMany(() => DetailPlan, detailPlan => detailPlan.device, { nullable: true })
    detailPlans: DetailPlan[];

    @OneToMany(() => DailyDivision, dailyVision => dailyVision.device, { nullable: true })
    dailyVisions: DailyDivision[];

    @BeforeInsert()
    generateQrCode() {
        this.qrCode = this.id; // Gán giá trị của id vào qrCode
    }
}
