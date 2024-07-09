import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from 'nestjs-firebase';
import {
  MongoNotification,
  NotificationSchema,
} from './models/mongo-notification.model';
import { AuthModule } from '../../auth/infrastructure';
import { LoggerModule, UUIDModule } from '@app/core';
import { NotificationsController } from './controllers/notifications.controller';
import { GetUserNotificationsQuery, NotReadCountQuery } from './queries';
import { NOTIFICATION_REPOSITORY } from './constants';
import { MongoNotificationRepository } from './repositories/mongo-notification.repository';
import { PushSenderService } from './provider/push-sender.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoNotification.name,
        schema: NotificationSchema,
      },
    ]),
    FirebaseModule.forRoot({
      googleApplicationCredential: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      },
    }),
    AuthModule,
    UUIDModule,
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [
    PushSenderService,
    GetUserNotificationsQuery,
    NotReadCountQuery,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: MongoNotificationRepository,
    },
  ],
  exports: [PushSenderService, NOTIFICATION_REPOSITORY],
})
export class NotificationsModule {}
