// notification.entity.ts

import { DateTimeEntity } from 'src/common/entities/DateTime.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Notification extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column({
        nullable: false,
        default: 0,
        type: 'int'
    })
    type: number;

    @Column({
        nullable: false,
        default: false,
        type: 'bool'
    })
    status: boolean;

    @ManyToOne(() => User, users => users.notifications, { nullable: false })
    user: User;
    // Các trường khác tùy thuộc vào yêu cầu của bạn

}
