import { ValueObject } from '@app/core';
import { InvalidBlogDateException } from '../exceptions';

export class BlogDate implements ValueObject<BlogDate> {
  constructor(private readonly _date: Date) {
    if (this._date > new Date()) throw new InvalidBlogDateException();
  }

  get value(): Date {
    return this._date;
  }

  equals(other: BlogDate): boolean {
    return this._date === other.value;
  }
}
