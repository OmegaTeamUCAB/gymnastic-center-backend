import { Result } from '@app/core/utils';

export interface Service<T, R> {
  execute(data: T): Promise<Result<R>>;
}
