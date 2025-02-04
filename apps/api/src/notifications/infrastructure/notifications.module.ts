import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MongoNotificationsRepository } from './repositories/mongo-notifications.repository';
import { PushSenderService } from './provider/push-sender.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoNotification.name,
        schema: NotificationSchema,
      },
    ]),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        googleApplicationCredential: {
          projectId: configService.get('FIREBASE_PROJECT_ID'),
          privateKey: configService
            .get('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
          clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
        },
      }),
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
      useClass: MongoNotificationsRepository,
    },
  ],
  exports: [PushSenderService],
})
export class NotificationsModule {}
