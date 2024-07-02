import { ValueObject } from '@app/core';
import { InvalidBlogTagsException } from '../exceptions';

export class BlogTag implements ValueObject<BlogTag> {
  constructor(private readonly _tag: string) {
    if (_tag.length < 0) throw new InvalidBlogTagsException();
  }

  get value(): string {
    return this._tag;
  }

  equals(other: BlogTag): boolean {
    return this._tag === other.value;
  }
}
