import { Lesson } from './lessons/lesson';
import {
  InvalidLessonQuantityException,
  InvalidVideoQuantityException,
} from './exceptions';

export class Course {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public level: number,
    public tags: string[],
    public weeks: number,
    public minutes: number,
    public imageUrl: string,
    public categoryId: string,
    public instructorId: string,
    public lessons: Lesson[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    if (this.lessons.length === 0) throw new InvalidLessonQuantityException();
    if (!this.lessons.some((lesson) => lesson.videoUrl))
      throw new InvalidVideoQuantityException();
  }
}
