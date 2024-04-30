import { ApplicationException } from '../exceptions/application-exception';

export class Result<T> {
  private constructor(private value?: T, private error?: ApplicationException) {
    if (value !== undefined && error !== undefined)
      throw new Error('Value and error not to be definined same time');
    else if (value === undefined && error === undefined)
      throw new Error('Value and error not to be undefined same time');
  }

  unwrap(): T {
    if (this.error) throw this.error;
    return this.value!;
  }

  unwrapOr(defaultValue: T): T {
    if (this.value === undefined) return defaultValue;
    return this.value;
  }

  get isSuccessful() {
    return !this.error;
  }

  get isFailure() {
    return !this.value;
  }

  static success<T>(value: T) {
    return new Result(value, undefined);
  }

  static failure<T>(error: ApplicationException) {
    return new Result<T>(undefined, error);
  }
}
