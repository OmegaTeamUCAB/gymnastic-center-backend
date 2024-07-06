import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidUserProgressIdException } from '../exceptions';

export class UserProgressId implements ValueObject<UserProgressId> {
  constructor(private _id: string) {
    const segments = _id.split(':');
    if (
      segments.length !== 2 ||
      !UUIDRegExp.test(segments[0]) ||
      !UUIDRegExp.test(segments[1])
    )
      throw new InvalidUserProgressIdException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: UserProgressId): boolean {
    return this._id === other.value;
  }
}
