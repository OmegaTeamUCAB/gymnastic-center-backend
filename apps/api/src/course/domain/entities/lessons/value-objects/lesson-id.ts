import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidLessonIdException } from '../exceptions';

export class LessonId implements ValueObject<LessonId> {
  constructor(private _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidLessonIdException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: LessonId): boolean {
    return this._id === other.value;
  }
}
