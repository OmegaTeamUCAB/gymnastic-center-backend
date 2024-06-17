import { EventHandlerModule, EventStoreModule, UUIDModule } from '@app/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { AuthModule } from '../../auth/infrastructure';
import {
  BlogSchema,
  MongoBlog,
} from '@app/core/infrastructure/models/mongo-blog.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoBlog.name,
        schema: BlogSchema,
      },
    ]),
    AuthModule,
    UUIDModule,
    EventStoreModule,
    EventHandlerModule,
  ],
  controllers: [BlogController],
  providers: [],
})
export class BlogModule {}
