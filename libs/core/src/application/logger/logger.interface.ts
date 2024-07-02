export interface ILogger {
    log(message: string): void;
    logError(message: string): void;
}