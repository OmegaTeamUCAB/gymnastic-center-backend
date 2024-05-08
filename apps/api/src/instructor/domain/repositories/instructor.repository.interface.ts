import { Instructor } from '../entities/instructor.entity';

export interface InstructorRepository {
  getInstructors(): Promise<Instructor[]>;
  getInstructorById(id: string): Promise<Instructor>;
}
