export interface IExceptionParser {
    parse(exception: Error): Error; 
}