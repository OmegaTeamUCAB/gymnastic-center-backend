import { ReadModel } from '@app/core/application';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SearchableCourseDocument } from '../../models/mongo-searchable-course';
import { MongoSearchableBlog } from '../../models/mongo-searchable-blog';
import { SearchBlogsDto, SearchBlogsResponse } from './types';

@Injectable()
export class SearchBlogsReadModel
  implements ReadModel<SearchBlogsDto, SearchBlogsResponse>
{
  constructor(
    @InjectModel(MongoSearchableBlog.name)
    private readonly model: Model<SearchableCourseDocument>,
  ) {}

  async execute(data: SearchBlogsDto): Promise<SearchBlogsResponse> {
    return this.model.aggregate([
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
  }
}
