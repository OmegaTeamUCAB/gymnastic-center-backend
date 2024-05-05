import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import * as FormData from 'form-data';
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs';
import { ConfigurableModuleClass, OPTIONS_TYPE } from './mailgun.definition';
import { MAILGUN } from './constants';

@Global()
@Module({})
export class MailgunModule extends ConfigurableModuleClass {
  constructor() {
    super();
  }

  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const { key, retryAttempts = 3 } = options;
    const retryDelay = 1000;
    const logger = new Logger('MailgunModule');
    const connectionProvider = {
      provide: MAILGUN,
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () => {
            const mailgun = new Mailgun(FormData);
            const client = mailgun.client({
              username: 'api',
              key,
            });
            return client;
          }).pipe(
            retry({
              count: retryAttempts,
              delay: (error: string) => {
                logger.error(
                  `Unable to connect to Mailgun. Retrying (${error})...`,
                  '',
                );
                return timer(retryDelay);
              },
            }),
            catchError((error) => {
              // Log the error on final failure
              logger.error(
                `Unable to connect to Mailgun after ${retryAttempts} attempts: ${error.message}`,
              );
              throw error; // Re-throw for further handling if needed
            }),
          ),
        ),
    };
    return {
      module: MailgunModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }
}
