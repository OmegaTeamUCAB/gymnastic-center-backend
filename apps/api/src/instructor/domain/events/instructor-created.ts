import { DomainEvent } from '@app/core';
import {
  InstructorFollowers,
  InstructorId,
  InstructorName,
  InstructorUserFollow,
} from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import {
  AddressCity,
  AddressCoordinates,
  AddressCountry,
} from '../entities/address-entity/value-objects';

export type InstructorCreatedEvent = DomainEvent<InstructorCreated>;

export class InstructorCreated {
  private constructor() {}
  name: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  followers: number;
  static createEvent(
    dispatcher: InstructorId,
    instructorName: InstructorName,
    instructorCountry: AddressCountry,
    instructorCity: AddressCity,
    instructorLatitude: AddressCoordinates,
    instructorLongitude: AddressCoordinates,
    instructorFollowers: InstructorFollowers,
  ): InstructorCreatedEvent {
    console.log('DISPATCHER: ',dispatcher.value)
    return DomainEventFactory<InstructorCreated>({
      dispatcherId: dispatcher.value,
      name: InstructorCreated.name,
      context: {
        name: instructorName.value,
        country: instructorCountry.value,
        city: instructorCity.value,
        latitude: instructorLatitude.latitude,
        longitude: instructorLongitude.longitude,
        followers: instructorFollowers.value,
      },
    });
  }
}
