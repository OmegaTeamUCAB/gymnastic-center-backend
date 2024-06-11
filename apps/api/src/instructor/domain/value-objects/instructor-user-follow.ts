import { ValueObject } from '@app/core';
import { InvalidInstructorUserFollowException } from '../exceptions/invalid-instructor-user-follow.exception';

export class InstructorUserFollow implements ValueObject<InstructorUserFollow> {
  constructor(private _userFollow: boolean) {
    if (typeof _userFollow !== 'boolean')
      throw new InvalidInstructorUserFollowException();
  }

  get value(): boolean {
    return this._userFollow;
  }

  equals(other: InstructorUserFollow): boolean {
    return this._userFollow === other.value;
  }
}
