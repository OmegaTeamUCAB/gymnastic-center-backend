import { ApplicationService, Result } from '@app/core';
import { CourseRepository } from '../../../domain';
import { GetCoursesResponse } from '../types/get-courses-response.type';
import { GetCoursesByCategoryDto } from './types/dto.type';

export class GetCoursesByCategoryQuery
  implements ApplicationService<GetCoursesByCategoryDto, GetCoursesResponse>
{
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(
    data: GetCoursesByCategoryDto,
  ): Promise<Result<GetCoursesResponse>> {
    const courses = await this.courseRepository.getCoursesByCategoryId(
      data.categoryId,
    );
    return Result.success<GetCoursesResponse>(
      courses.map(
        ({ id, name, imageUrl, categoryId, instructorId, createdAt }) => ({
          id,
          title: name,
          image: imageUrl,
          category: categoryId,
          trainer: instructorId,
          date: createdAt,
        }),
      ),
    );
  }
}
