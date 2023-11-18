import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './common/config/validation.config';
import { DatabaseModule } from './database/database.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { BaseService } from './base/base.service';
import { BaseController } from './base/base.controller';
import { DeviceModule } from './device/device.module';
import { FactoryModule } from './factory/factory.module';
import { PlanModule } from './plan/plan.module';
import { WorkStatusModule } from './work-status/work-status.module';
import { DetailPlanModule } from './detail-plan/detail-plan.module';
import { DailyDivisionModule } from './daily-division/daily-division.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema,
    envFilePath: [`.env`, `.env.${process.env.NODE_ENV}`], // load env
  }), DatabaseModule, AuthModule, UserModule, StorageModule, DeviceTypesModule, DeviceModule, FactoryModule, PlanModule, WorkStatusModule, DetailPlanModule, DailyDivisionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
