import { Service } from '@app/core/application';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  MongoSearchableCourse,
  SearchableCourseDocument,
} from '../../../models/mongo-searchable-course';
import { SearchDto } from '../../../types/dto.type';
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
export class MongoSearchCoursesService
  implements Service<SearchDto, Response>
{
  constructor(
    @InjectModel(MongoSearchableCourse.name)
    private readonly model: Model<SearchableCourseDocument>,
  ) {}

  async execute(data: SearchDto): Promise<Result<Response>> {
    try {
      const hits = await this.model.aggregate<MongoSearchableCourse>([
        {
          $search: {
            index: 'course-search',
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
              ],
            },
          },
        },
        {
          $limit: Math.max(1, data.limit),
        },
      ]);
      return Result.success<Response>(
        hits.map((hit) => ({
          ...hit,
          tags: hit.tags.split(','),
        })),
      );
    } catch (error) {
      return Result.failure(new Error(error));
    }
  }
}
