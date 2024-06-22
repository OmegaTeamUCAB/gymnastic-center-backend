import { ValueObject } from '@app/core';
import { InvalidCourseDurationException } from '../exceptions';

export class CourseDuration implements ValueObject<CourseDuration> {
  constructor(
    private _weeks: number,
    private _minutes: number,
  ) {
    if (_weeks < 1 || _minutes < 1) throw new InvalidCourseDurationException();
  }

  get weeks(): number {
    return this._weeks;
  }

  get minutes(): number {
    return this._minutes;
  }

  equals(other: CourseDuration): boolean {
    return this._weeks === other.weeks && this._minutes === other.minutes;
  }
}
