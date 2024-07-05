import { ValueObject } from '@app/core';
import { InvalidInstructorLocationException } from '../exceptions/invalid-instructor-location.exception';

export class InstructorLocation implements ValueObject<InstructorLocation> {
  constructor(
    private readonly _city: string,
    private readonly _country: string,
  ) {
    if (this._city.length < 2 || this._city.length > 50)
      throw new InvalidInstructorLocationException();
    if (this._country.length < 2 || this._country.length > 50)
      throw new InvalidInstructorLocationException();
  }

  get city(): string {
    return this._city;
  }

  get country(): string {
    return this._country;
  }

  equals(other: InstructorLocation): boolean {
    return this.city === other.city && this.country === other.country;
  }
}
