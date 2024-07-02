import { ValueObject } from '@app/core';
import { InvalidLessonVideoException } from '../exceptions';

export class LessonVideo implements ValueObject<LessonVideo> {
  constructor(private _video: string) {
    if (_video.length <= 0) throw new InvalidLessonVideoException();
  }

  get value(): string {
    return this._video;
  }

  equals(other: LessonVideo): boolean {
    return this._video === other.value;
  }
}
