import { ValueObject } from '@app/core';
import { InvalidLessonDescriptionException } from '../exceptions';

export class LessonDescription implements ValueObject<LessonDescription> {
  constructor(private _description: string) {
    if (_description.length <= 0) throw new InvalidLessonDescriptionException();
  }

  get value(): string {
    return this._description;
  }

  equals(other: LessonDescription): boolean {
    return this._description === other.value;
  }
}
