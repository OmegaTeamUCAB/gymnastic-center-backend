import { Gender } from 'apps/api/src/instructors/domain/entities/instructor.entity';

export type GetInstructorByIdResponse = {
    id: string;
    name: string;
    lastName: string;
    email: string;
    gender: Gender;
}