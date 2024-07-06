import { MongoCategory, MongoCourse } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryResponse } from '../controllers/responses';

type Dto = {
  page: number;
  perPage: number;
};

export class GetAllCategoriesQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly categoryModel: Model<MongoCategory>,
  ) {}

  async execute(dto: Dto): Promise<CategoryResponse[]> {
    const { page, perPage } = dto;
    const categories = await this.categoryModel.find({}, null, {
      skip: (page - 1) * perPage,
      limit: perPage,
    });
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
    }));
  }
}
