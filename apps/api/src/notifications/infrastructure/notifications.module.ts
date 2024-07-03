import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from 'nestjs-firebase';
import {
  MongoNotification,
  NotificationSchema,
} from './models/mongo-notification.model';
import { AuthModule } from '../../auth/infrastructure';
import { UUIDModule } from '@app/core';
import { NotificationsController } from './controllers/notifications.controller';
import {
  GetNotificationQuery,
  GetUserNotificationsQuery,
  NotReadCountQuery,
} from './queries';

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
  ],
  controllers: [NotificationsController],
  providers: [
    GetNotificationQuery,
    GetUserNotificationsQuery,
    NotReadCountQuery,
  ],
})
export class NotificationsModule {}
