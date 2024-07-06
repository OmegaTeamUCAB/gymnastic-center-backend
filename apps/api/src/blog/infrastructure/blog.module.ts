import { EventStoreModule, LoggerModule, UUIDModule } from '@app/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Get, Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { AuthModule } from '../../auth/infrastructure';
import {
  BlogSchema,
  MongoBlog,
} from '@app/core/infrastructure/models/mongo-blog.model';
import { GetAllBlogsQuery, GetBlogByIdQuery, GetBlogCountQuery } from './queries';

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
    LoggerModule,
  ],
  controllers: [BlogController],
  providers: [
    GetAllBlogsQuery,
    GetBlogByIdQuery,
    GetBlogCountQuery,
  ],
})
export class BlogModule {}
