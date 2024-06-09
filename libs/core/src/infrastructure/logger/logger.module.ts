import { Module } from '@nestjs/common';
import { NestLoggerService } from './providers/logging.service';

@Module({
    imports : [],
    controllers : [],
    providers : [
        {
            provide : 'LoggerService',
            useClass : NestLoggerService
        }
    ],
    exports : ['LoggerService']
})
export class LoggerModule {}
