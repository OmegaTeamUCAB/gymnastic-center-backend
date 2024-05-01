import { Module } from '@nestjs/common';
import { InstructorsController } from './controllers/instructor.controller';
import { Instructor, InstructorSchema } from './models/instructor.model';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }])],
  controllers: [InstructorsController],
  providers: [],
})
export class InstructorsModule {}
