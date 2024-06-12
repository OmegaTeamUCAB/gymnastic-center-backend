import { ApplicationService } from "../services/application-service";
import { PerformanceMonitorService } from "../performance/performance.interface";
import { Result } from "@app/core/utils";

export class PerformanceMonitorDecorator<T, U>
    implements ApplicationService<T, U> {
    constructor(
        private readonly service: ApplicationService<T, U>,
        private readonly perfMonitor: PerformanceMonitorService,
    ) { }

    async execute(data: T): Promise<Result<U>> {
        const label = `ServiceExecution-${new Date().toISOString()}`;
        this.perfMonitor.start(label);

        const result = await this.service.execute(data);

        this.perfMonitor.stop(label);

        return result;
    }
}