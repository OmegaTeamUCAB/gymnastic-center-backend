import { UUIDModule } from '@app/core';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog.controller';
import { BlogSchema, MongoBlog } from './models/blog.model';
import { BLOG_REPOSITORY } from './constants';
import { MongoBlogRepository } from './repositories';
import { AuthModule } from '../../auth/infrastructure';

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
