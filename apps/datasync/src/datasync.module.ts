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
  CourseSchema,
  MongoCourse,
  BlogSchema,
  MongoBlog,
  MongoProgress,
  ProgressSchema,
} from '@app/core';
import { DatasyncController } from './datasync.controller';
import {
  AlgoliaBlogProjector,
  AlgoliaCourseProjector,
  MongoCategoryProjector,
  MongoCommentProjector,
  MongoCourseProjector,
  MongoInstructorProjector,
  MongoProgressProjector,
  MongoUserProjector,
} from './projectors';
import { MongoBlogProjector } from './projectors/blog/mongo-blog.projector';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_EVENTS_QUEUE: Joi.string().required(),
        MONGODB_CNN: Joi.string().required(),
        ALGOLIA_ID: Joi.string().required(),
        ALGOLIA_KEY: Joi.string().required(),
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
      {
        name: MongoProgress.name,
        schema: ProgressSchema,
      },
    ]),
  ],
  controllers: [DatasyncController],
  providers: [
    AlgoliaBlogProjector,
    AlgoliaCourseProjector,
    MongoUserProjector,
    MongoCategoryProjector,
    MongoCourseProjector,
    MongoBlogProjector,
    MongoCommentProjector,
    MongoInstructorProjector,
    MongoProgressProjector,
    {
      provide: 'PROJECTORS',
      useFactory: (
        categoryProjector: MongoCategoryProjector,
        instructorProjector: MongoInstructorProjector,
        userProjector: MongoUserProjector,
        blogProjector: MongoBlogProjector,
        commentProjector: MongoCommentProjector,
        courseProjector: MongoCourseProjector,
        progressProjector: MongoProgressProjector,
        algoliaBlogProjector: AlgoliaBlogProjector,
        algoliaCourseProjector: AlgoliaCourseProjector,
      ) => [
        categoryProjector,
        instructorProjector,
        userProjector,
        blogProjector,
        commentProjector,
        courseProjector,
        progressProjector,
        algoliaBlogProjector,
        algoliaCourseProjector,
      ],
      inject: [
        MongoCategoryProjector,
        MongoInstructorProjector,
        MongoCourseProjector,
        MongoUserProjector,
        MongoBlogProjector,
        MongoCommentProjector,
        MongoProgressProjector,
        AlgoliaBlogProjector,
        AlgoliaCourseProjector,
      ],
    },
  ],
})
export class DatasyncModule {}
