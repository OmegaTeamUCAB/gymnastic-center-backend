import { Inject } from '@nestjs/common';

export const InjectAlgoliaRecommendations = () =>
  Inject('ALGOLIA_RECOMMENDATIONS');
