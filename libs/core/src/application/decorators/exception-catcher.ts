import { ApplicationService } from '../services/application-service';
import { Result } from '../result-wrapper/result';

export class ExceptionCatcherDecorator<T, U>
  implements ApplicationService<T, U>
{
  constructor(private service: ApplicationService<T, U>) {}
  async execute(data: T): Promise<Result<U>> {
    try {
      const result = await this.service.execute(data);
      if (result.isFailure) result.unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
