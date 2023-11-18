import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'boolean', default: false, nullable: true })
    isDeleted: boolean;
}
