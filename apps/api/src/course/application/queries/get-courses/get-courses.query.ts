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
