import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetInstructorByIdQuery } from '../../application/queries/get-instructor-by-id/get-instructor-by-id.query';
import { GetInstructorByIdDto } from '../../application/queries/get-instructor-by-id/types/get-instructor-by-id.dto';
import { InstructorResponse } from '../responses/instructor.response';
import { InstructorRepository } from '../../domain/repositories/instructor.repository.interface';
import { INSTRUCTORS_REPOSITORY } from '../constants';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { UserIdReq } from '../../../auth/infrastructure/decorators/user-id.decorator';

@Controller('trainer')
@ApiTags('Instructors')
@Auth()
export class InstructorsController {
  constructor(
    @Inject(INSTRUCTORS_REPOSITORY)
    private readonly repository: InstructorRepository,
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
  async findOneInstructor(
    @Param('id') id: string,
    @UserIdReq() userId: string,
  ) {
    const data: GetInstructorByIdDto = { id };
    const getInstructorByIdQuery = new GetInstructorByIdQuery(this.repository);
    const result = await getInstructorByIdQuery.execute(data);
    const instructor = result.unwrap();
    return {
      id: instructor.id,
      name: instructor.name,
      followers: 100,
      userFollow: false,
      location: 'Caracas, Venezuela',
    };
  }
}
