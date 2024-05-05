import { ApplicationService, Result } from '@app/core';
import { UpdateCourseDto, UpdateCourseResponse } from './types';
import { CourseRepository } from '../../../domain';
import { CourseNotFoundException } from '../../exceptions';

export class UpdateCourseCommand
  implements ApplicationService<UpdateCourseDto, UpdateCourseResponse>
{
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(data: UpdateCourseDto): Promise<Result<UpdateCourseResponse>> {
    const course = await this.courseRepository.getCourseById(data.id);
    if (!course)
      return Result.failure<UpdateCourseResponse>(new CourseNotFoundException());
    course.name = data.name ?? course.name;
    course.description = data.description ?? course.description;
    course.level = data.level ?? course.level;
    course.weeks = data.weeks ?? course.weeks;
    course.minutes = data.minutes ?? course.minutes;
    course.imageUrl = data.imageUrl ?? course.imageUrl;
    course.categoryId = data.categoryId ?? course.categoryId;
    course.tags = data.tags ?? course.tags;
    course.updatedAt = new Date();
    await this.courseRepository.saveCourse(course);
    return Result.success<UpdateCourseResponse>({
      id: course.id,
    });
  }
}
