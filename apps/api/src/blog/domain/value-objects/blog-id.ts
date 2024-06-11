import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidBlogIdException } from '../exceptions';

export class BlogId implements ValueObject<BlogId> {
  constructor(private readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidBlogIdException();
  }

  get value(): string {
    return this._id;
  }

  public equals(other: BlogId): boolean {
    return this._id === other.value;
  }
}
