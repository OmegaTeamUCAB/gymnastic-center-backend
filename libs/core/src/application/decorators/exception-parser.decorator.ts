import { Service } from '../services/application-service';
import { Result } from '@app/core/utils';

export class ExceptionParserDecorator<T, U> implements Service<T, U> {
  constructor(
    private readonly service: Service<T, U>,
    private readonly errorHandler: (error: Result<U>) => void,
  ) {}

  async execute(data: T): Promise<Result<U>> {
    const result = await this.service.execute(data);
    if (result.isFailure) {
      this.errorHandler(result);
    }
    return result;
  }
}
