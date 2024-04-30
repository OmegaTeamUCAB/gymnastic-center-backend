export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
  }

  static exceptionName = this.constructor.name;

  get name() {
    return this.constructor.name;
  }
}
