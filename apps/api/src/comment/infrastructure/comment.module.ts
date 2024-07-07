import { EventStoreModule, LoggerModule, UUIDModule } from '@app/core';
import {
  CommentSchema,
  MongoComment,
} from '@app/core/infrastructure/models/mongo-comment.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/infrastructure';
import { CommentController } from './controllers/comment.controller';
import { UserModule } from '../../user/infrastructure/user.module';
import { CommentLikedPushNotificationEventHandler } from './event-handlers/comment-liked-push-notification.event-handler';
import { NotificationsModule } from '../../notifications/infrastructure/notifications.module';
import { MongoCommentRepository } from './repositories/mongo-comment.repository';
import { COMMENT_REPOSITORY } from './constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoComment.name,
        schema: CommentSchema,
      },
    ]),
    AuthModule,
    UUIDModule,
    EventStoreModule,
    LoggerModule,
    NotificationsModule,
    UserModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentLikedPushNotificationEventHandler,
    {
      provide: COMMENT_REPOSITORY,
      useClass: MongoCommentRepository,
    },
  ],
  exports: [MongooseModule],
})
export class CommentModule {}
