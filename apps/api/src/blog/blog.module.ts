import { Module } from '@nestjs/common';
import { BlogController } from './infraestructure/controllers/blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema, MongoBlog } from './infraestructure/models/blog.model';
import { UUIDModule } from '@app/core';

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
