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
  AddressCountry,
} from '../entities/address-entity/value-objects';

export type InstructorCreatedEvent = DomainEvent<InstructorCreated>;

export class InstructorCreated {
  private constructor() {}
  name: string;
  country: string;
  city: string;
  followers: number;
  userFollow: boolean;
  static createEvent(
    dispatcher: InstructorId,
    instructorName: InstructorName,
    instructorCity: AddressCity,
    instructorCountry: AddressCountry,
    instructorFollowers: InstructorFollowers,
    instructorUserFollow: InstructorUserFollow,
  ): InstructorCreatedEvent {
    return DomainEventFactory<InstructorCreated>({
      dispatcherId: dispatcher.value,
      name: InstructorCreated.name,
      context: {
        name: instructorName.value,
        city: instructorCity.value,
        country: instructorCountry.value,
        followers: instructorFollowers.value,
        userFollow: instructorUserFollow.value,
      },
    });
  }
}
