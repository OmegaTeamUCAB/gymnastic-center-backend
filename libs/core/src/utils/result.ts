export class Result<T> {
  private constructor(
    private value?: T,
    private error?: Error,
  ) {
    if (value !== undefined && error !== undefined)
      throw new Error('Value and error not to be defined at the same time');
  }

  unwrap(): T {
    if (this.error) throw this.error;
    return this.value!;
  }

  get isSuccessful() {
    return !this.error;
  }

  get isFailure() {
    return !!this.error;
  }

  static success<T>(value: T) {
    return new Result(value, undefined);
  }

  static failure<T>(error: Error) {
    return new Result<T>(undefined, error);
  }
}
