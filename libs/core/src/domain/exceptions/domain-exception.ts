export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
  }

  get name() {
    return this.constructor.name;
  }

  static get exceptionName() {
    return this.prototype.constructor.name;
  }
}
