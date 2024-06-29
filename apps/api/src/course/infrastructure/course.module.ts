import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './controllers/course.controller';
import {
  CourseSchema,
  MongoCourse,
} from '../../../../../libs/core/src/infrastructure/models/mongo-course.model';
import { EventHandlerModule, EventStoreModule, LoggerModule, UUIDModule } from '@app/core';
import { AuthModule } from '../../auth/infrastructure';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoCourse.name,
        schema: CourseSchema,
      },
    ]),
    AuthModule,
    UUIDModule,
    EventStoreModule,
    EventHandlerModule,
    LoggerModule,
  ],
  providers: [],
  controllers: [CourseController],
})
export class CourseModule {}
