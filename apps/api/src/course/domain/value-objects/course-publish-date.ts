import { ValueObject } from '@app/core';

export class CoursePublishDate implements ValueObject<CoursePublishDate> {
  constructor(private readonly _date: Date) {}

  get value(): Date {
    return this._date;
  }

  public equals(other: CoursePublishDate): boolean {
    return this._date === other.value;
  }
}
