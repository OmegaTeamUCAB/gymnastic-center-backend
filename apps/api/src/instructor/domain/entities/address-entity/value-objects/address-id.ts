import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidAddressException } from '../exceptions/invalid-address.exception';

export class AddressId implements ValueObject<AddressId> {
  constructor(private readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidAddressException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: AddressId): boolean {
    return this._id === other.value;
  }
}
