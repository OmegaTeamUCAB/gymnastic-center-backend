import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InstructorResponse } from '../responses/instructor.response';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';

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
  async findOneInstructor(@Param('id') id: string) {
    const data: GetInstructorByIdDto = { id };
    const getInstructorByIdQuery = new GetInstructorByIdQuery(this.repository);
    const result = await getInstructorByIdQuery.execute(data);
    const instructor = result.unwrap();
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
