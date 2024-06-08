import { ApplicationService } from '../services/application-service';
import { Result } from '../result-wrapper/result';
import { ILogger } from './logger.port';

export class LoggerDecorator<T, U> 
  implements ApplicationService<T, U> 
{  
  constructor(
    private readonly service: ApplicationService<T, U>,
    private readonly logger: ILogger
  ) {}
  
  async execute(data: T): Promise<Result<U>> {
    try {
      this.logger.log(`[LOGGER] - ${JSON.stringify(data)}`);
      const result = await this.service.execute(data);
      this.logger.log(`[LOGGER] - ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
}