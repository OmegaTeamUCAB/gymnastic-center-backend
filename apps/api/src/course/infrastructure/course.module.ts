import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './controllers/course.controller';
import { CourseSchema, MongoCourse } from './models/mongo-course.model';
import { MongoCourseRepository } from './repositories/mongo-course.repository';
import { COURSE_REPOSITORY } from './constants';
import { UUIDModule } from '@app/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoCourse.name,
        schema: CourseSchema,
      },
    ]),
    UUIDModule,
  ],
  providers: [
    {
      provide: COURSE_REPOSITORY,
      useClass: MongoCourseRepository,
    },
  ],
  controllers: [CourseController],
})
export class CourseModule {}
