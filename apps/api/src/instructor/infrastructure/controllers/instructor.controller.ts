import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InstructorResponse } from '../responses/instructor.response';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { MongoInstructor } from '../models/instructor.model';
import { Model } from 'mongoose';
import { InstructorNotFoundException } from '../../application/exceptions/instructor-not-found';

@Controller('trainer')
@ApiTags('Instructors')
@Auth()
export class InstructorsController {
  constructor(
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The instructor has been successfully found',
    type: [InstructorResponse],
  })
  @ApiResponse({
    status: 404,
    description: 'Instructor not found',
  })
  @Get('one/:id')
  async getInstructorById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InstructorResponse> {
    const instructor = await this.instructorModel.findOne({ aggregateId: id });
    if (!instructor) throw new InstructorNotFoundException();
    return {
      id: instructor.aggregateId,
      name: instructor.name,
      followers: instructor.followers,
      country: instructor.country,
      city: instructor.city,
      userFollow: instructor.userFollow,
    };
  }
}
