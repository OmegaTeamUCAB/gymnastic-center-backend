import { Course } from '../course';

export interface CourseRepository {
  saveCourse(course: Course): Promise<void>;
  getCourseById(id: string): Promise<Course>;
  getCourses(): Promise<Course[]>;
  getCoursesByCategoryId(categoryId: string): Promise<Course[]>;
  getCoursesByInstructorId(instructorId: string): Promise<Course[]>;
}
