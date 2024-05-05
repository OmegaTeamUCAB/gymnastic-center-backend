import { ApplicationService, Result } from '@app/core';
import { CourseRepository } from '../../../domain';
import { GetCoursesResponse } from '../types/get-courses-response.type';

export class GetCoursesQuery
  implements ApplicationService<void, GetCoursesResponse>
{
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(): Promise<Result<GetCoursesResponse>> {
    const courses = await this.courseRepository.getCourses();
    return Result.success<GetCoursesResponse>(
      courses.map(
        ({
          id,
          name,
          description,
          level,
          tags,
          weeks,
          minutes,
          imageUrl,
          categoryId,
          instructorId,
          lessons,
          createdAt,
          updatedAt,
        }) => ({
          id,
          name,
          description,
          level,
          tags,
          weeks,
          minutes,
          imageUrl,
          categoryId,
          instructorId,
          lessons: lessons.map(
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
              description,
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
          createdAt,
          updatedAt,
        }),
      ),
    );
  }
}
