import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

import { Server, Socket } from 'socket.io'
import { Notification } from './entities/notification.entity';
import { UseFilters, WsExceptionFilter } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    allowedHeaders: "*",
    origin: "*"
  }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() private server: Server;


  constructor(private readonly notificationService: NotificationService) { }
  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    console.log('Client connected:', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    console.log('Client disconnected:', client.id);
  }
  //admin push 
  @SubscribeMessage('send-to-users')
  async sendNotificationToUser(@MessageBody() payload: CreateNotificationDto): Promise<void> {
    const data = await this.notificationService.sendNotificationToUser(payload);
    if (data) {
      this.server.emit('notification', data);
    }
    else {
      this.server.emit('notification', "Error because user not found");
    }
  }

  @SubscribeMessage('notifications-received')
  async getNotificationsByUser(@MessageBody() { userId }: CreateNotificationDto) {
    const notifications = await this.notificationService.getNotificationsByUser(userId);
    this.server.emit('notifications', notifications);
  }


}
