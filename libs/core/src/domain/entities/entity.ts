import { ValueObject } from '../value-objects/value-object';

export abstract class Entity<T extends ValueObject<T>> {
  protected constructor(protected _id: T) {}

  get id(): T {
    return this._id;
  }

  equals(other: Entity<T>): boolean {
    return this._id.equals(other.id);
  }
}
