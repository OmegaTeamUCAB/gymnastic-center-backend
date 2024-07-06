import { Module } from '@nestjs/common';
import {
  AlgoliaSearchBlogsService,
  AlgoliaSearchCoursesService,
  GetPopularAlgoliaFacetsService,
} from './providers';
import { AlgoliaModule } from './algolia';

@Module({
  imports: [
    AlgoliaModule.forRoot({
      id: process.env.ALGOLIA_ID,
      key: process.env.ALGOLIA_KEY,
      isGlobal: true,
    }),
  ],
  providers: [
    AlgoliaSearchBlogsService,
    AlgoliaSearchCoursesService,
    GetPopularAlgoliaFacetsService,
  ],
  exports: [
    AlgoliaSearchBlogsService,
    AlgoliaSearchCoursesService,
    GetPopularAlgoliaFacetsService,
  ],
})
export class SearchModule {}
