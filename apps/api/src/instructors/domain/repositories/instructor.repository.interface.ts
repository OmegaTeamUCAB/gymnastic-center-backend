import { Instructor } from '../entities/instructor.entity';

export interface InstructorRepository {
    findAllInstructors(): Promise<Instructor[]>;
    findOneInstructor(id: string): Promise<Instructor>;
}