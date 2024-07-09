import { Optional } from '@app/core';
import { Course } from '../models/course.model';

export interface CourseRepository {
  findCourseById(courseId: string): Promise<Optional<Course>>;
}
