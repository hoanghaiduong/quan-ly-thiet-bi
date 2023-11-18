// plan.entity.ts

import { DailyDivision } from 'src/daily-division/entities/daily-division.entity';
import { DetailPlan } from 'src/detail-plan/entities/detail-plan.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    contents: string;

    @Column({ nullable: true })
    beginDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ default: false })
    isDelete: boolean;

    @ManyToOne(() => User, users => users.plans, { nullable: false })
    user: User;

    @OneToMany(() => DetailPlan, detailPlan => detailPlan.plan, { nullable: true })
    detailPlans: DetailPlan[];
    @OneToMany(() => DailyDivision, dailyVision => dailyVision.plan, { nullable: true })
    dailyVisions: DailyDivision[];
}
