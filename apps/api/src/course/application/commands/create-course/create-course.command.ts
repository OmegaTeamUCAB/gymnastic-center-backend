import { ApplicationService, Result } from '@app/core';
import { CreateCourseDto, CreateCourseResponse } from './types';
import { Course, CourseRepository, Lesson } from '../../../domain';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';

export class CreateCourseCommand
  implements ApplicationService<CreateCourseDto, CreateCourseResponse>
{
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(data: CreateCourseDto): Promise<Result<CreateCourseResponse>> {
    const id = this.idGenerator.generateId();
    const lessons = data.lessons.map(
      lesson => {
        return new Lesson(
          this.idGenerator.generateId(),
          lesson.title,
          [],
          lesson.content,
          lesson.videoUrl,
          lesson.imageUrl,
        );
      }
    );
    const course = new Course(
      id,
      data.title,
      data.description,
      data.level,
      data.tags,
      data.weeks,
      data.minutes,
      data.imageUrl,
      data.categoryId,
      data.instructorId,
      lessons,
      new Date(),
      new Date(),
    );
    await this.courseRepository.saveCourse(course);
    return Result.success<CreateCourseResponse>({
      id,
    });
  }
}
