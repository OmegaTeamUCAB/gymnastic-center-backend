import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import {
  CategorySchema,
  CommentSchema,
  EventReplayModule,
  InstructorSchema,
  MongoCategory,
  MongoComment,
  MongoInstructor,
  MongoUser,
  RabbitMQModule,
  SearchModule,
  UserSchema,
} from '@app/core';
import { DatasyncController } from './datasync.controller';
import {
  CourseSchema,
  MongoCourse,
} from '@app/core/infrastructure/models/mongo-course.model';
import {
  BlogSchema,
  MongoBlog,
} from '@app/core/infrastructure/models/mongo-blog.model';
import { AlgoliaBlogProjector } from './projectors/search/blog/algolia-blog.projector';
import { AlgoliaCourseProjector } from './projectors/search/course/algolia-course.projector';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_EVENTS_QUEUE: Joi.string().required(),
        MONGODB_CNN: Joi.string().required(),
      }),
      envFilePath: './apps/datasync/.env',
    }),
    RabbitMQModule,
    EventReplayModule,
    SearchModule,
    MongooseModule.forRoot(process.env.MONGODB_CNN),
    MongooseModule.forFeature([
      {
        name: MongoCategory.name,
        schema: CategorySchema,
      },
      {
        name: MongoUser.name,
        schema: UserSchema,
      },
      {
        name: MongoInstructor.name,
        schema: InstructorSchema,
      },
      {
        name: MongoBlog.name,
        schema: BlogSchema,
      },
      {
        name: MongoCourse.name,
        schema: CourseSchema,
      },
      {
        name: MongoComment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [DatasyncController],
  providers: [AlgoliaBlogProjector, AlgoliaCourseProjector],
})
export class DatasyncModule {}
