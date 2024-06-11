import { ValueObject } from '@app/core';
import { InvalidBlogTitleException } from '../exceptions';

export class BlogTitle implements ValueObject<BlogTitle> {
  constructor(private readonly _title: string) {
    if (_title.length <= 0) throw new InvalidBlogTitleException();
  }

  get value(): string {
    return this._title;
  }

  equals(other: BlogTitle): boolean {
    return this._title === other.value;
  }
}
