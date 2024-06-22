import { ValueObject } from '@app/core';
import { InvalidCourseTagException } from '../exceptions';

export class CourseTag implements ValueObject<CourseTag> {
  constructor(private _tag: string) {
    if (_tag.length < 0) throw new InvalidCourseTagException();
  }

  get value(): string {
    return this._tag;
  }

  equals(other: CourseTag): boolean {
    return this._tag === other.value;
  }
}
