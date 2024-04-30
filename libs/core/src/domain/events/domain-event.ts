export abstract class DomainEvent {
  constructor(protected _time = new Date()) {}

  get time() {
    return this._time;
  }

  get eventName() {
    return this.constructor.name;
  }

  static get eventName() {
    return this.prototype.constructor.name;
  }
}
