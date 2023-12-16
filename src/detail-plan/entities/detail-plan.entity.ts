// detail-plan.entity.ts

import { Logger } from '@nestjs/common';
import { DateTimeEntity } from 'src/common/entities/DateTime.entity';
import { DailyDivision } from 'src/daily-division/entities/daily-division.entity';
import { Device } from 'src/device/entities/device.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import { WorkStatus } from 'src/work-status/entities/work-status.entity';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne, BeforeInsert, BeforeUpdate } from 'typeorm';

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

    @Column({ nullable: true, type: 'date' })
    expectedDate: string;

    @Column({ nullable: true })
    notes: string;

    @Column({ default: 0 })
    percents: number;

    @Column({ default: 'PM' })//PM CM
    typePlan: string;

    @Column({ default: 3, type: 'int' })
    status: number;//0 là chưa hoàn thành , 1 là hoàn thành , 2 là đang làm , 3 là chưa làm, 4 là chờ xác nhận

    @ManyToOne(() => Device, devices => devices.detailPlans, { nullable: false })
    device: Device;

    @ManyToOne(() => Plan, plans => plans.detailPlans, { nullable: false, onDelete: 'CASCADE' })
    plan: Plan;


    // @ManyToOne(() => WorkStatus)
    // workStatus: WorkStatus;
    @OneToOne(() => DailyDivision, dailyDivision => dailyDivision.detailPlan)
    dailyDivision: DailyDivision;

    @ManyToOne(() => User, users => users.detailPlans, { onDelete: 'CASCADE' })
    user: User;

    @BeforeUpdate()


    async CheckStatusExpect(): Promise<void> {

        // const expectedDate = new Date(this.expectedDate).toLocaleDateString();
        // const planBeginDate = new Date(this.plan.beginDate).toLocaleDateString();
        // const planEndDate = new Date(this.plan.endDate).toLocaleDateString();

        // if (expectedDate > planEndDate) {
        //     this.status = 0;
        // } else if (expectedDate <= planEndDate && expectedDate >= planBeginDate) {
        //     this.status = 2;
        // } else if (expectedDate < planBeginDate) {
        //     this.status = 3;
        // } else {
        //     const completedDate = new Date(this.dailyDivision.completedDate).toLocaleDateString();
        //     if (completedDate >= planBeginDate && completedDate <= planEndDate) {
        //         this.status = 1;
        //     }
        // }
        // Logger.debug("ExpectedDate" + expectedDate + "Plan begin Date" + planBeginDate + "|" + "Plan End Date" + planEndDate)
        const currentDate = new Date().toLocaleDateString();
        if (this.dailyDivision !== null) {
            this.status = 1;
            this.status = this.dailyDivision.status;
        }
        else {
            const expectedDate = new Date(this.expectedDate).toLocaleDateString('default');
        //    Logger.debug(currentDate > expectedDate, currentDate + "|" + expectedDate)
            if (currentDate > expectedDate) {
                this.status = 0;
            } else if (expectedDate === currentDate) {
                this.status = 2;
            } else if (currentDate < expectedDate) {
                this.status = 3;
            }
        }

    }

}
