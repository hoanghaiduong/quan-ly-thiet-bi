
import { DateTimeEntity } from 'src/common/entities/DateTime.entity';
import { DetailPlan } from 'src/detail-plan/entities/detail-plan.entity';
import { Device } from 'src/device/entities/device.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import { WorkStatus } from 'src/work-status/entities/work-status.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DailyDivision extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', nullable: true })
    workDay: string;

    @Column({ type: 'time', nullable: true })
    startTime: string;

    @Column({ type: 'time', nullable: true })
    estimateFinishTime: string;

    @Column({ type: 'float', nullable: true })
    totalTime: number;
    @Column({ nullable: true, length: 500 })
    specificContents: string;

    @Column({ default: 1 })
    quantity: number;

    @Column({ nullable: true, length: 255 })
    reason: string;

    @Column({ nullable: true, length: 500 })
    jobDescription: string;

    @Column({
        type: 'text',
        array: true,
        nullable: true
    })
    beforeImage: string[];

    @Column({
        type: 'text',
        array: true,
        nullable: true
    })
    afterImage: string[];

    @Column({ type: 'date', nullable: true })
    completedDate: string;

    @Column({ nullable: true })
    checkedBy: string;


    @Column({ default: 3, type: 'int' })
    status: number;//0 là chưa hoàn thành , 1 là hoàn thành , 2 là đang làm , 3 là chưa làm, 4 là chờ xác nhận

    @ManyToOne(() => Device, devices => devices.dailyVisions, { nullable: false })
    device: Device;

    // @ManyToOne(() => Plan, plans => plans.dailyVisions, { nullable: false })
    // plan: Plan;

    @OneToOne(() => DetailPlan, (chiTietKeHoach) => chiTietKeHoach.dailyDivision, { nullable: false })
    @JoinColumn()
    detailPlan: DetailPlan;

    @ManyToOne(() => User, users => users.dailyVisions, { nullable: false })
    user: User;

    // @ManyToOne(() => WorkStatus, workStatus => workStatus.dailyVisions, { nullable: false })
    // workStatus: WorkStatus;


    @BeforeUpdate()
    async setStatuSyncWithRelation(): Promise<void> {
        this.detailPlan.status = this.status;
    }

    @BeforeInsert()
    @BeforeUpdate()
    calculateTotalTime(): void {
        if (this.startTime && this.estimateFinishTime) {
            const startTime = new Date(`1970-01-01 ${this.startTime}`);
            const finishTime = new Date(`1970-01-01 ${this.estimateFinishTime}`);
            const timeDifference = finishTime.getTime() - startTime.getTime();

            // Calculate total time in hours
            this.totalTime = timeDifference / (1000 * 60 * 60);
        } else {


            this.totalTime = null; // or set it to any default value based on your requirement
        }
    }


}