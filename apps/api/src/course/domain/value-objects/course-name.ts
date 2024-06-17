import { ValueObject } from '@app/core';
import { InvalidCourseNameException } from '../exceptions';

export class CourseName implements ValueObject<CourseName> {
  private constructor(private _name: string) {
    if (_name.length < 4) throw new InvalidCourseNameException();
  }

  get value(): string {
    return this._name;
  }

  equals(other: CourseName): boolean {
    return this._name === other.value;
  }
}
