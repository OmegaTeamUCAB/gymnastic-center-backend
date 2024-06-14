import { ValueObject } from '@app/core';
import { InvalidUserImageException } from '../exceptions';

export class UserImage implements ValueObject<UserImage> {
  constructor(private readonly _image: string) {
    if (!UserImage.isValid(_image)) throw new InvalidUserImageException()
  }

  get value(): string {
    return this._image;
  }

  equals(other: UserImage): boolean {
    return this._image === other._image;
  }

  private static isValid(image: string): boolean {
    return image.length > 0;
  }
}
