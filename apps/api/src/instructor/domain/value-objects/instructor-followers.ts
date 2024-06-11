import { ValueObject } from '@app/core';
import { InvalidInstructorFollowersException } from '../exceptions/invalid-instructor-followers.exception';

export class InstructorFollowers implements ValueObject<InstructorFollowers> {
  //Userid[] para el tipo de followers
  //if (_followers.length < 0) throw new InvalidInstructorFollowersException();
  constructor(private readonly _followers: number) {
    if (_followers < 0) throw new InvalidInstructorFollowersException();
  }

  get value(): number {
    return this._followers;
  }

  equals(other: InstructorFollowers): boolean {
    return this._followers === other.value;
  }
}
