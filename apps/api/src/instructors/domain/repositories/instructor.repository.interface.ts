import { Instructor } from '../entities/instructor.entity';

//TODO: findAllInstructors ; findOneInstructor
export interface InstructorRepository {
    findAll(): Promise<Instructor[]>;
    findOne(id: string): Promise<Instructor>;
}