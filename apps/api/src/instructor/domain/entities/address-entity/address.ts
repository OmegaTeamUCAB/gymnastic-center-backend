import { Entity } from "@app/core";
import { AddressCity, AddressCountry, AddressId } from "./value-objects";

export class Address extends Entity<AddressId> {
  constructor(protected readonly _id: AddressId,
    public country: AddressCountry,
    public city: AddressCity,
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