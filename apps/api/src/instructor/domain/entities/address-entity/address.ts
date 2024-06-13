import { Entity } from '@app/core';
import { AddressCity, AddressCoordinates, AddressCountry, AddressId } from './value-objects';

export class Address extends Entity<AddressId> {
  constructor(
    protected readonly _id: AddressId,
    private _country: AddressCountry,
    private _city: AddressCity,
    private _coordinates: AddressCoordinates,
  ) {
    super(_id);
  }

  get id(): AddressId {
    return this._id;
  }
  get country(): AddressCountry {
    return this._country;
  }

  get city(): AddressCity {
    return this._city;
  }

  get coordinates(): AddressCoordinates {
    return this._coordinates;
  }

  equals(other: Entity<AddressId>): boolean {
    return this._id === other.id;
  }
}
