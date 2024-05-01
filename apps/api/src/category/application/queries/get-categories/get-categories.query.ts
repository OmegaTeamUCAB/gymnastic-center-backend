import { ApplicationService, Result } from '@app/core';
import { CategoryRepository } from '../../../domain';
import { GetCategoriesResponse } from './types/response.type';

export class GetCategoriesQuery
  implements ApplicationService<void, GetCategoriesResponse>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Result<GetCategoriesResponse>> {
    const categories = await this.categoryRepository.getCategories();
    return Result.success<GetCategoriesResponse>(
      categories.map(({ id, name, icon }) => ({
        id,
        name,
        icon,
      })),
    );
  }
}
