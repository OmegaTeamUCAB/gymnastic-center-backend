import { Result } from '@app/core/utils';
import { Service } from '../services/application-service';

export class ExceptionCatcherDecorator<T, U>
  implements Service<T, U>
{
  constructor(private service: Service<T, U>) {}
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
