import { ValueObject } from '@app/core';
import { InvalidCoordinatesException } from '../exceptions/invalid-coordinates.exception';

export class AddressCoordinates implements ValueObject<AddressCoordinates> {
  constructor(
    private readonly _latitude: number,
    private readonly _longitude: number,
  ) {
    if (
      _latitude < -90 ||
      _latitude > 90 ||
      _longitude < -180 ||
      _longitude > 180
    )
      throw new InvalidCoordinatesException();
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  equals(other: AddressCoordinates): boolean {
    return (
      this._latitude === other.latitude && this._longitude === other.longitude
    );
  }
}
