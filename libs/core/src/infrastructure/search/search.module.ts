import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoSearchableCourse,
  SearchableCourseSchema,
} from './models/mongo-searchable-course';
import {
  MongoSearchableBlog,
  SearchableBlogSchema,
} from './models/mongo-searchable-blog';
import {
  MongoSearchBlogsService,
  MongoSearchCoursesService,
  AlgoliaSearchBlogsService,
  AlgoliaSearchCoursesService
} from './providers';
import { AlgoliaModule } from './algolia';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoSearchableCourse.name,
        schema: SearchableCourseSchema,
      },
      {
        name: MongoSearchableBlog.name,
        schema: SearchableBlogSchema,
      },
    ]),
    AlgoliaModule.forRoot({
      id: 'JO0RL6UF13',
      key: '1fd6690555027c659bff016ad9af8ddf',
      isGlobal: true,
    }),
  ],
  providers: [
    MongoSearchBlogsService,
    MongoSearchCoursesService,
    AlgoliaSearchBlogsService,
    AlgoliaSearchCoursesService,
  ],
  exports: [
    MongoSearchBlogsService,
    MongoSearchCoursesService,
    AlgoliaSearchBlogsService,
    AlgoliaSearchCoursesService,
  ],
})
export class SearchModule {}
