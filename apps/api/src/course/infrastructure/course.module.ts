import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './controllers/course.controller';
import {
  CourseSchema,
  EventHandlerModule,
  EventStoreModule,
  LoggerModule,
  MongoCourse,
  MongoProgress,
  ProgressSchema,
  UUIDModule,
  MongoQuestion,
  QuestionSchema,
} from '@app/core';
import { AuthModule } from '../../auth/infrastructure';
import { ProgressController } from './controllers/progress.controller';
import { QuestionController } from './controllers/question.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoCourse.name,
        schema: CourseSchema,
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
    AuthModule,
    UUIDModule,
    EventStoreModule,
    EventHandlerModule,
    LoggerModule,
  ],
  providers: [],
  controllers: [CourseController, ProgressController, QuestionController],
  exports: [MongooseModule],
})
export class CourseModule {}
