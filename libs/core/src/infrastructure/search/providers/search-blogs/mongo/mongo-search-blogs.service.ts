import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SearchableCourseDocument } from '../../../models/mongo-searchable-course';
import { MongoSearchableBlog } from '../../../models/mongo-searchable-blog';
import { SearchDto } from '../../../types/dto.type';
import { Service } from '@app/core/application';
import { Result } from '@app/core/utils';

type Response = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: string[];
  readonly imageUrl: string;
  readonly categoryName: string;
  readonly instructorName: string;
}[];

@Injectable()
export class MongoSearchBlogsService
  implements Service<SearchDto, Response>
{
  constructor(
    @InjectModel(MongoSearchableBlog.name)
    private readonly model: Model<SearchableCourseDocument>,
  ) {}

  async execute(data: SearchDto): Promise<Result<Response>> {
    try {
      const hits = await this.model.aggregate<MongoSearchableBlog>([
        {
          $search: {
            index: 'blog-search',
            compound: {
              should: [
                {
                  autocomplete: {
                    query: data.searchTerm,
                    path: 'title',
                    score: { boost: { value: 5 } },
                  },
                },
                {
                  autocomplete: {
                    query: data.searchTerm,
                    path: 'categoryName',
                    score: { boost: { value: 3 } },
                  },
                },
                {
                  autocomplete: {
                    query: data.searchTerm,
                    path: 'instructorName',
                    score: { boost: { value: 3 } },
                  },
                },
                {
                  autocomplete: {
                    query: data.searchTerm,
                    path: 'tags',
                    score: { boost: { value: 2 } },
                  },
                },
                {
                  autocomplete: {
                    query: data.searchTerm,
                    path: 'description',
                  },
                },
                {
                  autocomplete: {
                    query: data.searchTerm,
                    path: 'content',
                  },
                },
              ],
            },
          },
        },
        {
          $limit: Math.max(1, data.limit),
        },
      ]);
      return Result.success(hits);
    } catch (error) {
      return Result.failure(new Error(error));
    }
  }
}
