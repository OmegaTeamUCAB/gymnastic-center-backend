import { MongoCategory } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryResponse } from '../controllers/responses';
import { NotFoundException } from '@nestjs/common';
import { CategoryNotFoundException } from '../../application/exceptions';

type Dto = {
  id: string;
};

export class GetCategoryByIdQuery {
  constructor(
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
  ) {}

  async execute(dto: Dto): Promise<CategoryResponse> {
    const { id } = dto;
    const category = await this.categoryModel.findOne({
      id,
    });
    if (!category) throw new NotFoundException(new CategoryNotFoundException());
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
    };
  }
}
