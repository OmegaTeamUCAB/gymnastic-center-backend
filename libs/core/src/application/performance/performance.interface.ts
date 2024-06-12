export interface PerformanceMonitorService {
    start(label: string): void;
    stop(label: string): void;
}