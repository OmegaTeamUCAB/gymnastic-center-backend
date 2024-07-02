import { EventStoreModule, LoggerModule, UUIDModule } from '@app/core';
import {
  CommentSchema,
  MongoComment,
} from '@app/core/infrastructure/models/mongo-comment.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/infrastructure';
import { CommentController } from './controllers/comment.controller';

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
  ],
  controllers: [CommentController],
  providers: [],
  exports: [MongooseModule],
})
export class CommentModule {}
