// plan.entity.ts

import { DateTimeEntity } from 'src/common/entities/DateTime.entity';
import { DailyDivision } from 'src/daily-division/entities/daily-division.entity';
import { DetailPlan } from 'src/detail-plan/entities/detail-plan.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    contents: string;

    @Column({ nullable: false, type: 'date' })
    beginDate: string;

    @Column({ nullable: false, type: 'date' })
    endDate: string;

    @Column({ default: 0, type: 'int', nullable: true })
    status: number;
    @Column({ default: false })
    isDelete: boolean;

    @Column({ nullable: true, default: false })
    isCopy: boolean
    @ManyToOne(() => User, users => users.plans, { nullable: false })
    user: User;

    @OneToMany(() => DetailPlan, detailPlan => detailPlan.plan, { nullable: true })
    detailPlans: DetailPlan[];
    @OneToMany(() => DailyDivision, dailyVision => dailyVision.plan, { nullable: true })
    dailyVisions: DailyDivision[];
}
