import { ApplicationService } from '../services/application-service';
import { IExceptionParser } from '../exceptions/exception-parser.interface';
import { Result } from '@app/core/utils';

export class ExceptionParserDecorator<T, U> 
    implements ApplicationService<T, U>
{
    constructor(
        private readonly service: ApplicationService<T, U>,
        private readonly exceptionParser: IExceptionParser
    ) {}

    async execute(data: T): Promise<Result<U>> {
        try {
            return await this.service.execute(data);
        } catch (error) {
            throw this.exceptionParser.execute(error);
        }
    }
}