import { Injectable } from '@nestjs/common';
import { InjectAlgolia } from '../algolia/inject-algolia.decorator';
import { SearchClient, SearchIndex } from 'algoliasearch';
import { Service } from '@app/core/application';
import { Result } from '@app/core/utils';

interface DTO {
  page: number;
  perPage: number;
}

@Injectable()
export class GetPopularAlgoliaFacetsService implements Service<DTO, string[]> {
  constructor(
    @InjectAlgolia()
    private readonly algolia: SearchClient,
  ) {
    this.blogIndex = this.algolia.initIndex('blogs');
    this.courseIndex = this.algolia.initIndex('courses');
  }

  private blogIndex: SearchIndex;
  private courseIndex: SearchIndex;

  async execute(dto: DTO): Promise<Result<string[]>> {
    const [blogFacets, courseFacets] = await Promise.all([
      this.blogIndex.searchForFacetValues('tags', '', {
        maxFacetHits: dto.perPage,
        page: dto.page - 1,
      }),
      this.courseIndex.searchForFacetValues('tags', '', {
        maxFacetHits: dto.perPage,
        page: dto.page - 1,
      }),
    ]);
    let blogTags = blogFacets.facetHits;
    let courseTags = courseFacets.facetHits;
    const facets: { value: string; count: number }[] = [];
    blogTags.forEach((tag) => {
      const courseTag = courseTags.find(
        (courseTag) => courseTag.value === tag.value,
      );
      if (courseTag) {
        facets.push({
          value: tag.value,
          count: tag.count + courseTag.count,
        });
        courseTags = courseTags.filter(
          (courseTag) => courseTag.value !== tag.value,
        );
      } else {
        facets.push(tag);
      }
    });
    facets.push(...courseTags);
    facets.sort((a, b) => b.count - a.count);
    return Result.success<string[]>(
      facets.map((facet) => `${facet.value} (${facet.count})`),
    );
  }
}
