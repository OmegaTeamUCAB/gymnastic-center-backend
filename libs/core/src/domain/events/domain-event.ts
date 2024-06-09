export abstract class DomainEvent<T = Object> {
  constructor(
    protected _time = new Date()
  ) {}

  get occuredOn() {
    return this._time;
  }

  get eventName() {
    return this.constructor.name;
  }

  abstract get context(): T;

  static get eventName() {
    return this.prototype.constructor.name;
  }
}
