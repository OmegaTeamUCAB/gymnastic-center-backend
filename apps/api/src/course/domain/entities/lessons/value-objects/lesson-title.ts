import { ValueObject } from '@app/core';
import { InvalidLessonTitleException } from '../exceptions';

export class LessonTitle implements ValueObject<LessonTitle> {
  constructor(private _title: string) {
    if (_title.length < 0) throw new InvalidLessonTitleException();
  }

  get value(): string {
    return this._title;
  }

  equals(other: LessonTitle): boolean {
    return this._title === other.value;
  }
}
