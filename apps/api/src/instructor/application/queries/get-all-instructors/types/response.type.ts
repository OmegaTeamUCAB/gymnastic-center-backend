import { Gender } from '../../../../domain/entities/instructor.entity'

export type GetAllInstructorsResponse = {
    id: string;
    name: string;
    lastName: string;
    birthDate: Date;
    email: string;
    gender: Gender;
}[];