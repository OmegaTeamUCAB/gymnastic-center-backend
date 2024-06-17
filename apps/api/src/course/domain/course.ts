import { Lesson } from './lessons/lesson';
import {
  InvalidLessonQuantityException,
  InvalidVideoQuantityException,
} from './exceptions';
import { CourseDescription, CourseId, CourseImage, CourseLevel, CourseMinute, CourseName, CourseTag, CourseWeek } from './value-objects';
import { CategoryId } from '../../category/domain/value-objects/category-id';
import { InstructorId } from '../../instructor/domain/value-objects/instructor-id';

export class Course {
  constructor(
    public id: CourseId,
    public name: CourseName,
    public description: CourseDescription,
    public level: CourseLevel,
    public tags: CourseTag[],
    public weeks: CourseWeek,
    public minutes: CourseMinute,
    public imageUrl: CourseImage,
    public categoryId: CategoryId,
    public instructorId: InstructorId,
    public lessons: Lesson[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    if (this.lessons.length === 0) throw new InvalidLessonQuantityException();
    if (!this.lessons.some((lesson) => lesson.videoUrl))
      throw new InvalidVideoQuantityException();
  }
}
