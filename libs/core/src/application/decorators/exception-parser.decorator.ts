import { Service } from '../services/application-service';
import { Result } from '@app/core/utils';

export class ExceptionParserDecorator<T, U> implements Service<T, U> {
  constructor(
    private readonly service: Service<T, U>,
    private readonly exceptionHandler: (error: Error) => void,
  ) {}

  async execute(data: T): Promise<Result<U>> {
    try {
      const result = await this.service.execute(data);
      if (result.isFailure) result.unwrap();
      return result;
    } catch (error) {
      this.exceptionHandler(error);
    }
  }
}
