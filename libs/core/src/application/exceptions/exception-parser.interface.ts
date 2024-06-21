export interface IExceptionParser {
    execute(exception: Error): Error; 
}