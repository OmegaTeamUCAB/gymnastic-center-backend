import { ReadModel } from '@app/core/application';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  MongoSearchableCourse,
  SearchableCourseDocument,
} from '../../models/mongo-searchable-course';
import { SearchCoursesDto, SearchCoursesResponse } from './types';

@Injectable()
export class SearchCoursesReadModel
  implements ReadModel<SearchCoursesDto, SearchCoursesResponse>
{
  constructor(
    @InjectModel(MongoSearchableCourse.name)
    private readonly model: Model<SearchableCourseDocument>,
  ) {}

  async execute(data: SearchCoursesDto): Promise<SearchCoursesResponse> {
    return this.model.aggregate([
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
  }
}
