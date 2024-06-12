import { Entity } from '@app/core';
import { AddressCity, AddressCoordinates, AddressCountry, AddressId } from './value-objects';

export class Address extends Entity<AddressId> {
  constructor(
    protected readonly _id: AddressId,
    private country: AddressCountry,
    private city: AddressCity,
    private coordinates: AddressCoordinates,
  ) {
    super(_id);
  }

  get id(): AddressId {
    return this._id;
  }

  equals(other: Entity<AddressId>): boolean {
    return this._id === other.id;
  }
}
