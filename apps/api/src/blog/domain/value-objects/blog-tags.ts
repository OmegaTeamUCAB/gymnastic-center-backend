import { ValueObject } from '@app/core';
import { InvalidBlogTagsException } from '../exceptions';

export class BlogTags implements ValueObject<BlogTags> {
  constructor(private readonly _tags: string[]) {
    if (_tags.length < 0) throw new InvalidBlogTagsException();
  }

  get value(): string[] {
    return this._tags;
  }

  equals(other: BlogTags): boolean {
    return this._tags === other.value;
  }
}
