import { InstructorRepository } from '../../../domain/repositories/instructor.repository.interface';
import { GetAllInstructorsResponse } from './types/response.type';
import { ApplicationService, Result } from '@app/core';

export class GetAllInstructors
  implements ApplicationService<void, GetAllInstructorsResponse>
{
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(): Promise<Result<GetAllInstructorsResponse>> {
    const instructors = await this.instructorRepository.getInstructors();
    if (instructors.length === 0)
      return Result.success<GetAllInstructorsResponse>([]);
    return Result.success<GetAllInstructorsResponse>(
      instructors.map(({ id, name, lastName, birthDate, email, gender }) => ({
        id,
        name,
        lastName,
        birthDate,
        email,
        gender,
      })),
    );
  }
}
