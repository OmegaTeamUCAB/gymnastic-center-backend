import { ApplicationService } from '../services/application-service';
import { Result } from '@app/core/utils';
import { Logger } from '../logger/logger.interface';

export class LoggingDecorator<T, U>
  implements ApplicationService<T, U> {

  constructor(
    private readonly service: ApplicationService<T, U>,
    private readonly logger: Logger
  ) { }

  async execute(data: T): Promise<Result<U>> {
    this.logger.log(`${JSON.stringify(data)}`);
    const result = await this.service.execute(data);

    if (result.isFailure)
      this.logger.logError(`Execution failed: ${result.unwrap()}`);

    return result;
  }
}