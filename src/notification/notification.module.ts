import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule
  ],
  controllers:[NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule { }
