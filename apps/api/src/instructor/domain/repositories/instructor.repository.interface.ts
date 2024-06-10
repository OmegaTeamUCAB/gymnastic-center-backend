import { Instructor } from '../instructor';

export interface InstructorRepository {
  getInstructors(): Promise<Instructor[]>;
  getInstructorById(id: string): Promise<Instructor>;
}
