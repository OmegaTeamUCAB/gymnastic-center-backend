import { Service } from '../services/application-service';
import { ITimer } from '../timer/timer.interface';
import { Result } from '@app/core/utils';
import { ILogger } from '../logger/logger.interface';

export class PerformanceMonitorDecorator<T, R> implements Service<T, R> {
  constructor(
    private readonly service: Service<T, R>,
    private readonly timer: ITimer,
    private readonly logger: ILogger,
    private readonly operationName: string,
  ) {}

  async execute(data: T): Promise<Result<R>> {
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
