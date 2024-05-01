import { Instructor } from 'apps/api/src/instructors/domain/entities/instructor.entity'

export type GetAllInstructorsResponse = {
    instructors: Instructor[];
}