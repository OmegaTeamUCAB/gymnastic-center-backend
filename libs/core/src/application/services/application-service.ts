import { Result } from '@app/core/utils';

export interface ApplicationService<T, R> {
  execute(data: T): Promise<Result<R>>;
}
