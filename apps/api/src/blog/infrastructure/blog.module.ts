import { UUIDModule } from '@app/core';
import { BlogController } from './controllers/blog-controller/blog.controller';
import { BlogSchema, MongoBlog } from './models/blog.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoBlog.name,
        schema: BlogSchema,
      },
    ]),
    UUIDModule
  ],
  controllers: [BlogController],
  providers: [],
})
export class BlogModule { }