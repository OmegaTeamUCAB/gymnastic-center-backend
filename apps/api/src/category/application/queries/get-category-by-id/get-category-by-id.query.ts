import { ApplicationService, Result } from '@app/core';
import { CategoryRepository } from '../../../domain';
import { GetCategoryByIdDto, GetCategoryByIdResponse } from './types';
import { CategoryNotFoundException } from '../../exceptions';

export class GetCategoryByIdQuery
  implements ApplicationService<GetCategoryByIdDto, GetCategoryByIdResponse>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    data: GetCategoryByIdDto,
  ): Promise<Result<GetCategoryByIdResponse>> {
    const category = await this.categoryRepository.getCategoryById(data.id);
    if (!category)
      return Result.failure<GetCategoryByIdResponse>(
        new CategoryNotFoundException(),
      );
    return Result.success<GetCategoryByIdResponse>({
      id: category.id,
      name: category.name,
      icon: category.icon,
    });
  }
}
