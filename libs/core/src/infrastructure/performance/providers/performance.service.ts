import { Injectable, Logger } from '@nestjs/common';
import { PerformanceMonitorService } from '@app/core/application';

@Injectable()
export class NativePerformanceMonitor implements PerformanceMonitorService {
  private readonly logger = new Logger(NativePerformanceMonitor.name);
  private readonly timers = new Map<string, number>();

  start(label: string): void {
    this.timers.set(label, Date.now());
  }

  stop(label: string): number | undefined {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.timers.delete(label);
      return duration;
    } else {
      this.logger.warn(`No timer found for ${label}`);
      return undefined;
    }
  }
}
