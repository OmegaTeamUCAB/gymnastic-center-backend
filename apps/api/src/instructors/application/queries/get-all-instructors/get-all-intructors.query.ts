import { InstructorRepository } from '../../../domain/repositories/instructor.repository.interface';
import { InstructorsListEmpty } from '../../exceptions/instructors-list-empty';
import { GetAllInstructorsResponse } from './types/response.type';
import { ApplicationService, Result } from '@app/core';

export class GetAllInstructors implements ApplicationService<void, GetAllInstructorsResponse> {
    constructor(private readonly instructorRepository: InstructorRepository) { }

    async execute(data: void): Promise<Result<GetAllInstructorsResponse>> {
        const instructors = await this.instructorRepository.findAllInstructors();

        if (instructors.length === 0) return Result.failure(new InstructorsListEmpty());

        return Result.success<GetAllInstructorsResponse>(
            instructors.map(({ id, name, lastName, birthDate, email, gender}) => ({ 
                id,
                name,
                lastName,
                birthDate,
                email,
                gender,
             }))
        )
    }
}