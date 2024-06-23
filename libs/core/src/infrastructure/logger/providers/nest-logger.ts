import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '@app/core/application';

@Injectable()
export class NestLogger implements ILogger {
  private readonly logger = new Logger();

  log(message: string): void {
    this.logger.log(message);
  }

  logError(message: string): void {
    this.logger.error(message);
  }
}
