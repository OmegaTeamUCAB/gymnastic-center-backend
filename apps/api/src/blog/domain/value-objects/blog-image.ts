import { ValueObject } from '@app/core';
import { InvalidBlogImagesException } from '../exceptions';

export class BlogImage implements ValueObject<BlogImage> {
  constructor(private readonly _image: string) {
    if (_image.length < 0) throw new InvalidBlogImagesException();
  }

  get value(): string {
    return this._image;
  }

  equals(other: BlogImage): boolean {
    return this._image === other.value;
  }
}
