import { Device } from 'src/device/entities/device.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Factory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    facName: string;

    @Column({ nullable: true })
    alias: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    phone2: string;


    @Column({ default: false })
    isDelete: boolean;

    @OneToMany(() => Device, device => device.factory, { nullable: true })
    devices: Device[];

    @ManyToOne(() => User, users => users.factories, { nullable: false })
    user: User;
}
