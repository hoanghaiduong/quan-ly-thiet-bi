import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";
import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Role } from "src/common/enum/auth";
import { Factory } from "src/factory/entities/factory.entity";
import { Plan } from "src/plan/entities/plan.entity";
import { DailyDivision } from "src/daily-division/entities/daily-division.entity";
import { Notification } from "src/notification/entities/notification.entity";

@Entity('users')
export class User extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'boolean', default: false, nullable: true })
    gender: boolean;

    @Column({
        nullable: true,
    })
    avatar: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    phoneNumber2: string;

    @Column({ type: 'text', nullable: true })
    zalo: string;

    @Column({ type: 'boolean', default: true })
    isActived: boolean;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @Column({ nullable: false, default: Role.CUSTOMER, enum: Role })
    role: Role;

    @BeforeInsert()
    // @BeforeUpdate()
    async hashPassword() {
        // Check if the password field has been modified before hashing
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    @OneToMany(() => Factory, factories => factories.user, { nullable: true })
    factories: Factory[]
    @OneToMany(() => Plan, plan => plan.user, { nullable: true })
    plans: Plan[]
    @OneToMany(() => DailyDivision, dailyVision => dailyVision.user, { nullable: true })
    dailyVisions: DailyDivision[];

    @OneToMany(() => Notification, notification => notification.user, { nullable: true })
    notifications: Notification[]
}
