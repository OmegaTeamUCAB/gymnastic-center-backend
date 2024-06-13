import { Module } from '@nestjs/common';
import { MongoInstructor, InstructorSchema } from './models/instructor.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/infrastructure';
import { InstructorController } from './controllers/instructor.controller';
import { EventHandlerModule, EventStoreModule, UUIDModule } from '@app/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoInstructor.name, schema: InstructorSchema },
    ]),
    AuthModule,
    UUIDModule,
    EventStoreModule,
    EventHandlerModule,
  ],
  controllers: [InstructorController],
  providers: [],
})
export class InstructorModule {}
