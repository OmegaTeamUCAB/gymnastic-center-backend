import { Service } from '@app/core';
import { Result } from '@app/core/utils';

export class ExceptionHandlerDecoratorMock<T, U> implements Service<T, U> {
  constructor(private readonly service: Service<T, U>) {}

  async execute(data: T): Promise<Result<U>> {
    try {
      const result = await this.service.execute(data);
      if (result.isFailure) result.unwrap();
      return result;
    } catch (error) {
      return Result.failure(error);
    }
  }
}
