import { BaseEntity } from "src/base/entities/base.entity";
import { DailyDivision } from "src/daily-division/entities/daily-division.entity";
import { Entity, OneToMany } from "typeorm";
@Entity()
export class WorkStatus extends BaseEntity {
    @OneToMany(() => DailyDivision, dailyVision => dailyVision.workStatus, { nullable: true })
    dailyVisions: DailyDivision[];
}
