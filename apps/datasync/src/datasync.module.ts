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
  MongoQuestion,
  QuestionSchema,
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
  MongoBlogProjector,
  MongoQuestionProjector,
} from './projectors';

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
      {
        name: MongoQuestion.name,
        schema: QuestionSchema,
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
    MongoQuestionProjector,
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
        questionProjector: MongoQuestionProjector,
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
        questionProjector,
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
        MongoQuestionProjector,
        AlgoliaBlogProjector,
        AlgoliaCourseProjector,
      ],
    },
  ],
})
export class DatasyncModule {}
