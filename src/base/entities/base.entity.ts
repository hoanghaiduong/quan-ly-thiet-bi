import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false, nullable: true })
    isDeleted: boolean;
}
