import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidCourseIdException } from '../exceptions';

export class CourseId implements ValueObject<CourseId> {
  private constructor(private _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidCourseIdException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: CourseId): boolean {
    return this._id === other.value;
  }
}
