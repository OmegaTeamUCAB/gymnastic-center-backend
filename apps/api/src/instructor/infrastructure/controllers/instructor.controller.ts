import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetInstructorByIdQuery } from '../../application/queries/get-instructor-by-id/get-instructor-by-id.query';
import { GetInstructorByIdDto } from '../../application/queries/get-instructor-by-id/types/get-instructor-by-id.dto';
import { GetAllInstructors } from '../../application/queries/get-all-instructors/get-all-intructors.query';
import { InstructorResponse } from '../responses/instructor.response';
import { InstructorRepository } from '../../domain/repositories/instructor.repository.interface';
import { INSTRUCTORS_REPOSITORY } from '../constants';

@Controller('instructors')
@ApiTags('Instructors')
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
  @Get(':id')
  async findOneInstructor(@Param('id') id: string) {
    const data: GetInstructorByIdDto = { id };
    const getInstructorByIdQuery = new GetInstructorByIdQuery(this.repository);
    const result = await getInstructorByIdQuery.execute(data);
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'Instructors list',
    type: [InstructorResponse],
  })
  @Get()
  async findAllInstructors() {
    const getAllInstructors = new GetAllInstructors(this.repository);
    const result = await getAllInstructors.execute();
    return result.unwrap();
  }
}
