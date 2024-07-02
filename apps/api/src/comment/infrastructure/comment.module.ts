import { EventHandlerModule, EventStoreModule, LoggerModule, UUIDModule } from '@app/core';
import {
  CommentSchema,
  MongoComment,
} from '@app/core/infrastructure/models/mongo-comment.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/infrastructure';
import { CommentController } from './controllers';

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
    EventHandlerModule,
    LoggerModule,
  ],
  controllers: [CommentController],
  providers: [],
  exports: [MongooseModule],
})
export class CommentModule {}
