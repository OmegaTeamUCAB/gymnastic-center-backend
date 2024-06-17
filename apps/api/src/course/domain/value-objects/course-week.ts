import { ValueObject } from '@app/core';
import { InvalidCourseWeekException } from '../exceptions';

export class CourseWeek implements ValueObject<CourseWeek> {
  private constructor(private _weeks: number) {
    if (_weeks <= 0) throw new InvalidCourseWeekException();
  }

  get value(): number {
    return this._weeks;
  }

  equals(other: CourseWeek): boolean {
    return this._weeks === other.value;
  }
}
