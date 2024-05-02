import { Gender } from 'apps/api/src/instructors/domain/entities/instructor.entity'

export type GetAllInstructorsResponse = {
    id: string;
    name: string;
    lastName: string;
    birthDate: Date;
    email: string;
    gender: Gender;
}[];