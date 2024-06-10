import { Module } from '@nestjs/common';
import { NativeLogger } from './providers/logging.service';
import { LOGGER_SERVICE } from './constants';

@Module({
    imports : [],
    controllers : [],
    providers : [
        {
            provide : LOGGER_SERVICE,
            useClass : NativeLogger,
        }
    ],
    exports : [LOGGER_SERVICE]
})
export class LoggerModule {}
