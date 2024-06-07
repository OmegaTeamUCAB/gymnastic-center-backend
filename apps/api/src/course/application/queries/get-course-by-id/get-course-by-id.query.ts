import { ApplicationService, Result } from '@app/core';
import { CourseRepository } from '../../../domain';
import { GetCourseByIdDto, GetCourseByIdResponse } from './types';
import { CourseNotFoundException } from '../../exceptions';

export class GetCourseByIdQuery
  implements ApplicationService<GetCourseByIdDto, GetCourseByIdResponse>
{
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(
    data: GetCourseByIdDto,
  ): Promise<Result<GetCourseByIdResponse>> {
    const course = await this.courseRepository.getCourseById(data.id);
    if (!course)
      return Result.failure<GetCourseByIdResponse>(
        new CourseNotFoundException(),
      );
    return Result.success<GetCourseByIdResponse>({
      id: course.id,
      title: course.name,
      description: course.description,
      level: course.level,
      tags: course.tags,
      durationWeeks: course.weeks,
      durationMinutes: course.minutes,
      image: course.imageUrl,
      category: course.categoryId,
      trainer: course.instructorId,
      lessons: course.lessons.map(
        ({ id, title, content, videoUrl, imageUrl }) => ({
          id,
          title,
          content,
          video: videoUrl,
          image: imageUrl,
        }),
      ),
    });
  }
}
