import { Service } from '../services/application-service';
import { PerformanceMonitorService } from '../performance/performance.interface';
import { Result } from '@app/core/utils';
import { ILogger } from '../logger/logger.interface'

export class PerformanceMonitorDecorator<T, U>
    implements Service<T, U> {
    constructor(
        private readonly service: Service<T, U>,
        private readonly perfMonitor: PerformanceMonitorService,
        private readonly logger: ILogger
    ) { }

    async execute(data: T): Promise<Result<U>> {
        const label = `ServiceExecution-${new Date().toISOString()}`;
        this.perfMonitor.start(label);

        const result = await this.service.execute(data);
        const duration = this.perfMonitor.stop(label);
        this.logger.log(`Execution time for ${label}: ${duration}ms`);

        return result;
    }
}