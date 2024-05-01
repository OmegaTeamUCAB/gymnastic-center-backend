import { ApplicationService, Result } from '@app/core';
import { CreateCategoryDto, CreateCategoryResponse } from './types';
import { Category, CategoryRepository } from '../../../domain';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';

export class CreateCategoryCommand
  implements ApplicationService<CreateCategoryDto, CreateCategoryResponse>
{
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(
    data: CreateCategoryDto,
  ): Promise<Result<CreateCategoryResponse>> {
    const id = this.idGenerator.generateId();
    const category = new Category(id, data.name, data.icon);
    await this.categoryRepository.saveCategory(category);
    return Result.success<CreateCategoryResponse>({
      id,
    });
  }
}
