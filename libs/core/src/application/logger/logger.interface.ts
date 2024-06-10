export interface NativeLoggerService {
    log(message: string): void;
    logError(message: string): void;
}