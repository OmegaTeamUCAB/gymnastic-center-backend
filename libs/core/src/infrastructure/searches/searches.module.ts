import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoSearchableCourse,
  SearchableCourseSchema,
} from './models/mongo-searchable-course';
import { SearchCoursesReadModel } from './read-models/search-courses/search-courses.read-model';
import {
  MongoSearchableBlog,
  SearchableBlogSchema,
} from './models/mongo-searchable-blog';
import { SearchBlogsReadModel } from './read-models';

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
  ],
  providers: [SearchCoursesReadModel, SearchBlogsReadModel],
  exports: [SearchCoursesReadModel, SearchBlogsReadModel],
})
export class SearchesModule {}
