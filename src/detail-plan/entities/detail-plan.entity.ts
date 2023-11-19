// detail-plan.entity.ts

import { DateTimeEntity } from 'src/common/entities/DateTime.entity';
import { Device } from 'src/device/entities/device.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { WorkStatus } from 'src/work-status/entities/work-status.entity';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DetailPlan extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 1 })
    quantity: number;

    @Column({ nullable: true })
    unit: string;

    @Column({ nullable: true })
    specification: string;

    @Column({ nullable: true })
    expectedDate: Date;

    @Column({ nullable: true })
    notes: string;

    @Column({ default: 0 })
    percents: number;

    @Column({ default: 'PM' })//PM CM
    typePlan: string;

    @Column({ default: 0, type: 'int' })
    status: number;

    @ManyToOne(() => Device, devices => devices.detailPlans, { nullable: false })
    device: Device;

    @ManyToOne(() => Plan, plans => plans.detailPlans, { nullable: false })
    plan: Plan;

    @ManyToOne(() => WorkStatus)
    workStatus: WorkStatus;
}
