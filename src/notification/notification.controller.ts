import { Body, Controller, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification } from "./entities/notification.entity";

@Controller('notifications')
@ApiTags("Api Thông báo")
export class NotificationController {
    // constructor(private notificationService: NotificationService) { }
    // @Post('create-notification')
    // async CreateNotification(@Query('userId') userId: string, @Body() dto: CreateNotificationDto): Promise<Notification> {
    //     return await this.notificationService.sendNotificationToUser(userId, dto);
    // }
}