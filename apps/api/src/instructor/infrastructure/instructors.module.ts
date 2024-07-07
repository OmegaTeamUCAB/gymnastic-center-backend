import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/infrastructure';
import { InstructorController } from './controllers/instructor.controller';
import {
  EventStoreModule,
  UUIDModule,
  MongoInstructor,
  InstructorSchema,
  LoggerModule,
} from '@app/core';
import { GetAllInstructorsQuery, GetInstructorByIdQuery } from './queries';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoInstructor.name, schema: InstructorSchema },
    ]),
    AuthModule,
    UUIDModule,
    EventStoreModule,
    LoggerModule,
  ],
  controllers: [InstructorController],
  providers: [
    GetAllInstructorsQuery,
    GetInstructorByIdQuery,
  ],
})
export class InstructorModule {}
