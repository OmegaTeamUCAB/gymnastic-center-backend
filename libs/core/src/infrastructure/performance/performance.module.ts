import { Module } from '@nestjs/common';
import { NativePerformanceMonitor } from './providers/performance.service';
import { PERFORMANCE_MONITOR_SERVICE } from './constants';

@Module({
    imports : [],
    controllers : [],
    providers : [
        {
            provide : PERFORMANCE_MONITOR_SERVICE,
            useClass : NativePerformanceMonitor,
        }
    ],
    exports : [PERFORMANCE_MONITOR_SERVICE]
})
export class PerformanceMonitorModule {}