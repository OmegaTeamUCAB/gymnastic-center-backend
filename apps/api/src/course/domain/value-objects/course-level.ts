import { ValueObject } from '@app/core';
import { InvalidCourseLevelException } from '../exceptions';

export class CourseLevel implements ValueObject<CourseLevel> {
  constructor(private _level: number) {
    if (_level <= 0) throw new InvalidCourseLevelException();
  }

  get value(): number {
    return this._level;
  }

  equals(other: CourseLevel): boolean {
    return this._level === other.value;
  }
}
