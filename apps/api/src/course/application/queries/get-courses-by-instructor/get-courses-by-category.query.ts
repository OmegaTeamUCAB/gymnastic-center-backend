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
