import { ValueObject } from '@app/core';
import { InvalidBlogDateException } from '../exceptions';

export class BlogCreationDate implements ValueObject<BlogCreationDate> {
  constructor(private readonly _date: Date) {
    if (this._date > new Date()) throw new InvalidBlogDateException();
  }

  get value(): Date {
    return this._date;
  }

  equals(other: BlogCreationDate): boolean {
    return this._date === other.value;
  }
}
