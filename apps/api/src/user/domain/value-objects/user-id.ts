import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidUserIdException } from '../exceptions';

export class UserId implements ValueObject<UserId> {
  constructor(private readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidUserIdException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: UserId): boolean {
    return this._id === other._id;
  }
}
