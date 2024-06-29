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
  AlgoliaSearchCoursesService,
  GetPopularAlgoliaFacetsService
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
      id: process.env.ALGOLIA_ID,
      key: process.env.ALGOLIA_KEY,
      isGlobal: true,
    }),
  ],
  providers: [
    MongoSearchBlogsService,
    MongoSearchCoursesService,
    AlgoliaSearchBlogsService,
    AlgoliaSearchCoursesService,
    GetPopularAlgoliaFacetsService,
  ],
  exports: [
    MongoSearchBlogsService,
    MongoSearchCoursesService,
    AlgoliaSearchBlogsService,
    AlgoliaSearchCoursesService,
    GetPopularAlgoliaFacetsService,
  ],
})
export class SearchModule {}
