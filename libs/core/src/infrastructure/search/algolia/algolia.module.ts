import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import algoliasearch from 'algoliasearch';
import algoliaRecommend from '@algolia/recommend';
import aa from 'search-insights';
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs';
import { ConfigurableModuleClass, OPTIONS_TYPE } from './algolia.definition';

@Global()
@Module({})
export class AlgoliaModule extends ConfigurableModuleClass {
  constructor() {
    super();
  }

  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const { id, key, retryAttempts = 9, retryDelay = 3000 } = options;
    const logger = new Logger('AlgoliaModule');
    const connectionProvider = {
      provide: 'ALGOLIA',
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () => {
            const algolia = algoliasearch(id, key);
            return algolia;
          }).pipe(
            retry({
              count: retryAttempts,
              delay: (error: string) => {
                logger.error(
                  `Unable to connect to Algolia. Retrying (${error})...`,
                  '',
                );
                return timer(retryDelay);
              },
            }),
            catchError((error) => {
              // Log the error on final failure
              logger.error(
                `Unable to connect to Algolia after ${retryAttempts} attempts: ${error.message}`,
              );
              throw error; // Re-throw for further handling if needed
            }),
          ),
        ),
    };
    const insightsProvider = {
      provide: 'ALGOLIA_INSIGHTS',
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () => {
            aa('init', {
              appId: id,
              apiKey: key,
            });
            return aa;
          }).pipe(
            retry({
              count: retryAttempts,
              delay: (error: string) => {
                logger.error(
                  `Unable to connect to Algolia Insights. Retrying (${error})...`,
                  '',
                );
                return timer(retryDelay);
              },
            }),
            catchError((error) => {
              // Log the error on final failure
              logger.error(
                `Unable to connect to Algolia Insights after ${retryAttempts} attempts: ${error.message}`,
              );
              throw error; // Re-throw for further handling if needed
            }),
          ),
        ),
    };
    const recommendationsProvider = {
      provide: 'ALGOLIA_RECOMMENDATIONS',
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () => {
            const algolia = algoliaRecommend(id, key);
            return algolia;
          }).pipe(
            retry({
              count: retryAttempts,
              delay: (error: string) => {
                logger.error(
                  `Unable to connect to Algolia Recommendations. Retrying (${error})...`,
                  '',
                );
                return timer(retryDelay);
              },
            }),
            catchError((error) => {
              // Log the error on final failure
              logger.error(
                `Unable to connect to Algolia Recommendations after ${retryAttempts} attempts: ${error.message}`,
              );
              throw error; // Re-throw for further handling if needed
            }),
          ),
        ),
    };
    return {
      module: AlgoliaModule,
      providers: [
        connectionProvider,
        insightsProvider,
        recommendationsProvider,
      ],
      exports: [connectionProvider, insightsProvider, recommendationsProvider],
    };
  }
}
