import { UUIDModule } from '@app/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogSchema, MongoBlog } from './models/blog.model';
import { BLOG_REPOSITORY } from './constants';
import { MongoBlogRepository } from './repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoBlog.name,
        schema: BlogSchema,
      },
    ]),
    UUIDModule,
  ],
  controllers: [BlogController],
  providers: [
    {
      provide: BLOG_REPOSITORY,
      useClass: MongoBlogRepository,
    },
  ],
})
export class BlogModule {}
