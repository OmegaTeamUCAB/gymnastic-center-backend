import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects';
import { Address } from '../entities/address-entity/address';

export type InstructorAddressUpdatedEvent =
  DomainEvent<InstructorAddressUpdated>;
export class InstructorAddressUpdated {
  private constructor() {}
  country: string;
  city: string;
  static createEvent(
    dispatcher: InstructorId,
    address: Address,
  ): InstructorAddressUpdatedEvent {
    return {
      dispatcherId: dispatcher.value,
      name: InstructorAddressUpdated.name,
      timestamp: new Date(),
      context: {
        country: address.country.value,
        city: address.city.value,
      },
    };
  }
}
