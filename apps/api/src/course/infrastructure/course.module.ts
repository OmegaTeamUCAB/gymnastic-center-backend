import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './controllers/course.controller';
import {
  CourseSchema,
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
import {
  GetAllCoursesQuery,
  GetCourseByIdQuery,
  GetCourseCountQuery,
  GetCourseProgressQuery,
  GetLastWatchedCoursesQuery,
  GetWatchingCoursesQuery,
} from './queries';
import { MongoCourseRepository } from './repositories/mongo-course.repository';
import { COURSE_REPOSITORY } from './constants';

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
    LoggerModule,
  ],
  providers: [
    GetAllCoursesQuery,
    GetCourseByIdQuery,
    GetCourseCountQuery,
    GetCourseProgressQuery,
    GetLastWatchedCoursesQuery,
    GetWatchingCoursesQuery,
    {
      provide: COURSE_REPOSITORY,
      useClass: MongoCourseRepository,
    },
  ],
  controllers: [CourseController, ProgressController, QuestionController],
  exports: [MongooseModule],
})
export class CourseModule {}
