import { ValueObject } from '@app/core';
import { InvalidBlogDateException } from '../exceptions';

export class BlogCreationDate implements ValueObject<BlogCreationDate> {
  constructor(private readonly _creationDate: Date) {
    if (this._creationDate > new Date()) throw new InvalidBlogDateException();
  }

  get value(): Date {
    return this._creationDate;
  }

  equals(other: BlogCreationDate): boolean {
    return this._creationDate === other.value;
  }
}
