import { Module } from '@nestjs/common';
import { NestLogger } from './providers/nest-logger';
import { LOGGER } from './constants';

@Module({
    imports : [],
    controllers : [],
    providers : [
        {
            provide : LOGGER,
            useClass : NestLogger,
        }
    ],
    exports : [LOGGER]
})
export class LoggerModule {}
