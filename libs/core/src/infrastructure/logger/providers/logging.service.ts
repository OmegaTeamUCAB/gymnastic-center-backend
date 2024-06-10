import { Injectable, Logger } from "@nestjs/common";
import { NativeLoggerService } from "@app/core/application";

@Injectable()
export class NativeLogger implements NativeLoggerService {
    private readonly logger = new Logger('NATIVE LOGGER');
    
    log(message: string): void {
        this.logger.log(message);
    }
    
    logError(message: string): void {
        this.logger.error(message);
    }
}