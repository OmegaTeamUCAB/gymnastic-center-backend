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
      name: course.name,
      description: course.description,
      level: course.level,
      tags: course.tags,
      weeks: course.weeks,
      minutes: course.minutes,
      imageUrl: course.imageUrl,
      categoryId: course.categoryId,
      instructorId: course.instructorId,
      lessons: course.lessons.map(
        ({
          id,
          title,
          comments,
          content,
          videoUrl,
          imageUrl,
        }) => ({
          id,
          title,
          comments: comments.map(({ id, content, userId, createdAt }) => ({
            id,
            content,
            userId,
            createdAt,
          })),
          content,
          videoUrl,
          imageUrl,
        }),
      ),
    });
  }
}
