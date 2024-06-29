import { Module } from '@nestjs/common';
import { ExceptionParserService } from './providers/exception-parser.service';
import { EXCEPTION_PARSER_SERVICE } from './constants';

@Module({
    imports : [],
    controllers : [],
    providers: [
        {
            provide : EXCEPTION_PARSER_SERVICE,
            useClass : ExceptionParserService,
        }
    ],
    exports : []
})
export class ExceptionParserModule {}