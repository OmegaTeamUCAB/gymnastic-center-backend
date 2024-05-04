import { ApplicationService, Result } from '@app/core';
import { CourseRepository } from '../../../domain';
import { GetCoursesResponse } from '../types/get-courses-response.type';
import { GetCoursesByInstructorDto } from './types/dto.type';

export class GetCoursesByInstructorQuery
  implements ApplicationService<GetCoursesByInstructorDto, GetCoursesResponse>
{
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(
    data: GetCoursesByInstructorDto,
  ): Promise<Result<GetCoursesResponse>> {
    const courses = await this.courseRepository.getCoursesByInstructorId(
      data.instructorId,
    );
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
              description,
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
