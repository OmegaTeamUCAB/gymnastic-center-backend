import { Module } from '@nestjs/common';
import { InstructorsController } from './controllers/instructor.controller';
import { MongoInstructor, InstructorSchema } from './models/instructor.model';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoInstructorRepository } from './repositories/mongo-instructor.repository';
import { INSTRUCTORS_REPOSITORY } from './constants';
import { AuthModule } from '../../auth/infrastructure';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoInstructor.name, schema: InstructorSchema },
    ]),
    AuthModule,
  ],
  controllers: [InstructorsController],
  providers: [
    {
      provide: INSTRUCTORS_REPOSITORY,
      useClass: MongoInstructorRepository,
    },
  ],
})
export class InstructorModule {}
