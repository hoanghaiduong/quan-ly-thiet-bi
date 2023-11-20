
import { DateTimeEntity } from 'src/common/entities/DateTime.entity';
import { Device } from 'src/device/entities/device.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import { WorkStatus } from 'src/work-status/entities/work-status.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToOne(() => Device, devices => devices.dailyVisions, { nullable: false })
    device: Device;

    @ManyToOne(() => Plan, plans => plans.dailyVisions, { nullable: false })
    plan: Plan;

    @ManyToOne(() => User, users => users.dailyVisions, { nullable: false })
    user: User;

    @ManyToOne(() => WorkStatus, workStatus => workStatus.dailyVisions, { nullable: false })
    workStatus: WorkStatus;
}
