import { Service } from '../services/application-service';
import { ITimer } from '../timer/timer.interface';
import { Result } from '@app/core/utils';
import { ILogger } from '../logger/logger.interface';

export class PerformanceMonitorDecorator<T, U> implements Service<T, U> {
  constructor(
    private readonly service: Service<T, U>,
    private readonly timer: ITimer,
    private readonly logger: ILogger,
    private readonly operationName: string,
  ) {}

  async execute(data: T): Promise<Result<U>> {
    this.timer.start();
    const result = await this.service.execute(data);
    const duration = this.timer.stop();
    if (result.isSuccessful)
      this.logger.log(
        `Execution time for ${this.operationName}: ${duration}ms`,
      );
    return result;
  }
}
