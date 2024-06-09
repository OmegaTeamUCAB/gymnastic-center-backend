import { Injectable, Logger } from "@nestjs/common";
import { LoggerService } from "@app/core/application";

@Injectable()
export class NestLoggerService implements LoggerService {
    private readonly logger = new Logger();
    
    log(message: string): void {
        this.logger.log(message);
    }
    
    error(message: string): void {
        this.logger.error(message);
    }
    
    warn(message: string): void {
        this.logger.warn(message);
    }
}