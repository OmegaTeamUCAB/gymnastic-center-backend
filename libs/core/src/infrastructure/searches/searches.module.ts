import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoSearchableCourse,
  SearchableCourseSchema,
} from './models/mongo-searchable-course';
import { SearchCoursesReadModel } from './read-models/search-courses/search-courses.read-model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoSearchableCourse.name,
        schema: SearchableCourseSchema,
      },
    ]),
  ],
  providers: [SearchCoursesReadModel],
  exports: [SearchCoursesReadModel],
})
export class SearchesModule {}
