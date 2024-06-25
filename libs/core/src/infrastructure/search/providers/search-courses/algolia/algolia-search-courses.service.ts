import { Injectable } from '@nestjs/common';
import { SearchClient, SearchIndex } from 'algoliasearch';
import { SearchDto } from '../../../types/dto.type';
import { Service } from '@app/core/application';
import { Result } from '@app/core/utils';
import { InjectAlgolia } from '../../../algolia';

type Hit = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
  category: string;
  instructor: string;
};

type Response = Hit[];

@Injectable()
export class AlgoliaSearchCoursesService
  implements Service<SearchDto, Response>
{
  constructor(
    @InjectAlgolia()
    private readonly algolia: SearchClient,
  ) {
    this.index = this.algolia.initIndex('course');
  }

  private index: SearchIndex;

  async execute(data: SearchDto): Promise<Result<Response>> {
    try {
      const { hits } = await this.index.search<Hit>(data.searchTerm, {
        page: data.page - 1,
        hitsPerPage: data.limit,
        ...(data.tags &&
          data.tags.length > 0 && {
            facetFilters: data.tags.map((tag) => `tags:${tag}`),
          }),
      });
      return Result.success(
        hits.map((hit) => ({
          id: hit.id,
          name: hit.name,
          description: hit.description,
          tags: hit.tags,
          image: hit.image,
          category: hit.category,
          instructor: hit.instructor,
        })),
      );
    } catch (error) {
      return Result.failure(new Error(error));
    }
  }
}
