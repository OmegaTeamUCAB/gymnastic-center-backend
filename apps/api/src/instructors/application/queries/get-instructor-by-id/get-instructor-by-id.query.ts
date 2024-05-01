import { ApplicationService, Result } from '@app/core';
import { GetInstructorByIdDto, GetInstructorByIdResponse } from './types';
import { InstructorRepository } from '../../../domain/repositories/instructor.repository.interface';
import { InstructorNotFoundException } from '../../exceptions/instructor-not-found';

export class GetInstructorByIdQuery implements ApplicationService<GetInstructorByIdDto, GetInstructorByIdResponse> {
    constructor(public readonly instructorRepository: InstructorRepository) { }

    async execute(data: GetInstructorByIdDto): Promise<Result<GetInstructorByIdResponse>> {
        const user = await this.instructorRepository.findOne(data.id);

        if (!user) return Result.failure(new InstructorNotFoundException());

        return Result.success<GetInstructorByIdResponse>({
            id: data.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender
        });
    }
}