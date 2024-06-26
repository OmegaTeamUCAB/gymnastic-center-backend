import { Service } from '../services/application-service';
import { Result } from '@app/core/utils';
import { ILogger } from '../logger/logger.interface';

export class LoggingDecorator<T, U> implements Service<T, U> {
  constructor(
    private readonly service: Service<T, U>,
    private readonly logger: ILogger,
    private readonly operationName: string,
  ) {}

  async execute(data: T): Promise<Result<U>> {
    this.logger.log(
      `Attempting to execute ${this.operationName}. Given this data: ${JSON.stringify(data)}`,
    );
    const result = await this.service.execute(data);
    if (result.isFailure)
      this.logger.logError(
        `Execution of ${this.operationName} failed. Error: ${result.errorMessage}`,
      );
    else
      this.logger.log(
        `Execution of ${this.operationName} was successful. Data: ${JSON.stringify(data)}. Result: ${JSON.stringify(result.unwrap())}`,
      );
    return result;
  }
}
