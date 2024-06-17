import { ApplicationService, Result } from '@app/core';
import { UpdateCourseDto, UpdateCourseResponse } from './types';

export class UpdateCourseCommand
  implements ApplicationService<UpdateCourseDto, UpdateCourseResponse>
{
  constructor() {}

  async execute(data: UpdateCourseDto): Promise<Result<UpdateCourseResponse>> {
    return Result.success<UpdateCourseResponse>({
      id: data.id,
    });
  } 
}
