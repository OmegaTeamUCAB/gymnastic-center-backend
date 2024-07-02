import { ValueObject } from '@app/core';
import { InvalidBlogContentException } from '../exceptions';

export class BlogContent implements ValueObject<BlogContent> {
  constructor(private readonly _content: string) {
    if (_content.length < 10) throw new InvalidBlogContentException();
  }

  get value(): string {
    return this._content;
  }

  equals(other: BlogContent): boolean {
    return this.value === other.value;
  }
}
