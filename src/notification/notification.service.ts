import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Socket } from 'socket.io'
import { UserService } from 'src/user/user.service';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService
  ) { }

  async sendNotificationToUser(payload: CreateNotificationDto): Promise<Notification> {
    try {
      const user = await this.userService.getUserById(payload.userId);
      const creating = this.notificationRepository.create({
        ...payload,
        user,
      })
      const saved = await this.notificationRepository.save(creating);
      return saved
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const user = await this.userService.getRelation(userId, ["notifications"]);
    return user.notifications;
  }
}
