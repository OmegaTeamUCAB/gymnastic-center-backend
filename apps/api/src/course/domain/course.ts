import { Lesson } from './lessons/lesson';

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
  ) {}
}
