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
} from './providers';

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
  providers: [MongoSearchBlogsService, MongoSearchCoursesService],
  exports: [MongoSearchBlogsService, MongoSearchCoursesService],
})
export class SearchesModule {}
