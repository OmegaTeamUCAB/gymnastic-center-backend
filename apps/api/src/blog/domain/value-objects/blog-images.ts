import { ValueObject } from '@app/core';
import { InvalidBlogImagesException } from '../exceptions';

export class BlogImages implements ValueObject<BlogImages> {
  constructor(private readonly _images: string[]) {
    if (_images.length < 0) throw new InvalidBlogImagesException();
  }

  get value(): string[] {
    return this._images;
  }

  equals(other: BlogImages): boolean {
    return this._images === other.value;
  }
}
