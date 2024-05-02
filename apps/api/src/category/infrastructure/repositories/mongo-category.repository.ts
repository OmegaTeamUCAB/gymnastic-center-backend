import { Model } from 'mongoose';
import { Category } from '../../domain/category';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import {
  CategoryDocument,
  MongoCategory,
} from '../models/mongo-category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoCategoryRepository implements CategoryRepository {
  constructor(
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async saveCategory(category: Category): Promise<void> {
    await this.categoryModel.updateOne(
      {
        aggregateId: category.id,
      },
      {
        $set: {
          name: category.name,
          icon: category.icon,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const category = await this.categoryModel.findOne({
      aggregateId: id,
    });
    const { aggregateId, name, icon } = category;
    return category ? new Category(aggregateId, name, icon) : null;
  }

  async getCategories(): Promise<Category[]> {
    return (await this.categoryModel.find()).map(
      ({ aggregateId, name, icon }) => new Category(aggregateId, name, icon),
    );
  }
}
