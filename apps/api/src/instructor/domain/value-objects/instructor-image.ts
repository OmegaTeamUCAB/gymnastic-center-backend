import { ValueObject } from '@app/core';
import { InvalidInstructorImageException } from '../exceptions/invalid-instructor-image.exception';

export class InstructorImage implements ValueObject<InstructorImage> {
  constructor(private readonly _image: string) {
    if (_image.length === 0) throw new InvalidInstructorImageException();
  }

  get value(): string {
    return this._image;
  }

  equals(other: InstructorImage): boolean {
    return this._image == other.value;
  }
}
