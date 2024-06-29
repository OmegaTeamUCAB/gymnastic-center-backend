import {
    Injectable,
    Logger,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { IExceptionParser } from '@app/core/application';

@Injectable()
export class ExceptionParserService 
    implements IExceptionParser
{
    private readonly logger = new Logger(ExceptionParserService.name);

    parse(exception: Error): Error {
        if (exception instanceof BadRequestException) {
            return 
        } else {
        
        }
    }
}