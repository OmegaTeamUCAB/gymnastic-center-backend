import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { UserPhone } from '../value-objects/user-phone';
import { UserId } from '../value-objects';

export type UserPhoneUpdatedEvent = DomainEvent<UserPhoneUpdated>;

export class UserPhoneUpdated {
  private constructor() {}
  phone: string;
  static createEvent(
    dispatcher: UserId,
    userPhone: UserPhone,
  ): UserPhoneUpdatedEvent {
    return DomainEventFactory<UserPhoneUpdated>({
      dispatcherId: dispatcher.value,
      name: UserPhoneUpdated.name,
      context: {
        phone: userPhone.value,
      },
    });
  }
}
