import { Result } from '../result-wrapper/result';

export interface ApplicationService<T, R> {
  execute(data: T): Promise<Result<R>>;
}
