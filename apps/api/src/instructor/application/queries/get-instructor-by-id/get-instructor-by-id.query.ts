import { InstructorRepository } from '../../../domain/repositories/instructor.repository.interface';
import { InstructorNotFoundException } from '../../exceptions/instructor-not-found';
import { GetInstructorByIdDto, GetInstructorByIdResponse } from './types';
import { ApplicationService, Result } from '@app/core';

export class GetInstructorByIdQuery
  implements
    ApplicationService<GetInstructorByIdDto, GetInstructorByIdResponse>
{
  constructor(public readonly instructorRepository: InstructorRepository) {}

  async execute(
    data: GetInstructorByIdDto,
  ): Promise<Result<GetInstructorByIdResponse>> {
    const instructor = await this.instructorRepository.getInstructorById(
      data.id,
    );
    if (!instructor) return Result.failure(new InstructorNotFoundException());
    return Result.success<GetInstructorByIdResponse>({
      id: data.id,
      name: instructor.name,
      lastName: instructor.lastName,
      email: instructor.email,
      gender: instructor.gender,
    });
  }
}
