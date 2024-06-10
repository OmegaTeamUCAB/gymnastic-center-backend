import { ApplicationService } from '../services/application-service';
import { Result } from '../result-wrapper/result';
import { NativeLoggerService } from './logger.interface';

export class LoggerDecorator<T, U> 
  implements ApplicationService<T, U> 
{  
  constructor(
    private readonly service: ApplicationService<T, U>,
    private readonly logger: NativeLoggerService
  ) {}
  
  async execute(data: T): Promise<Result<U>> {
    try {
      this.logger.log(`${JSON.stringify(data)}`);
      const result = await this.service.execute(data);
      this.logger.log(`${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.logError(`${JSON.stringify(error)}`);
      throw error;
    }
  }
}