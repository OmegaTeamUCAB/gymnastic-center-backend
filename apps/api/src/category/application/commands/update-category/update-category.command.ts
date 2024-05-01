import { ApplicationService, Result } from '@app/core';
import { UpdateCategoryDto, UpdateCategoryResponse } from './types';
import { CategoryRepository } from '../../../domain';
import { CategoryNotFoundException } from '../../exceptions';

export class UpdateCategoryCommand
  implements ApplicationService<UpdateCategoryDto, UpdateCategoryResponse>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    data: UpdateCategoryDto,
  ): Promise<Result<UpdateCategoryResponse>> {
    const category = await this.categoryRepository.getCategoryById(data.id);
    if (!category)
      return Result.failure<UpdateCategoryResponse>(
        new CategoryNotFoundException(),
      );
    category.name = data.name ?? category.name;
    category.icon = data.icon ?? category.icon;
    await this.categoryRepository.saveCategory(category);
    return Result.success<UpdateCategoryResponse>({
      id: category.id,
    });
  }
}
