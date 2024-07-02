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
  providers: [],
})
export class InstructorModule {}
