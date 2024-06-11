export class Optional<T> {
  private constructor(private value?: T) {}

  unwrap(): T {
    if (!this.value) throw new Error('Value is not present');
    return this.value;
  }

  get hasValue() {
    return !!this.value;
  }

  static of<T>(value: T) {
    return new Optional(value);
  }

  static empty<T>() {
    return new Optional<T>();
  }
}
