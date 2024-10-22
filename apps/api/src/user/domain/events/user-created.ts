import { DomainEvent } from '@app/core';
import { UserId, UserName } from '../value-objects';
import { UserEmail } from '../value-objects/user-email';
import { UserPhone } from '../value-objects/user-phone';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type UserCreatedEvent = DomainEvent<UserCreated>;

export class UserCreated {
  private constructor() {}
  name: string;
  email: string;
  phone: string;

  static createEvent(
    dispatcher: UserId,
    userName: UserName,
    userEmail: UserEmail,
    userPhone: UserPhone,
  ): UserCreatedEvent {
    return DomainEventFactory<UserCreated>({
      dispatcherId: dispatcher.value,
      name: UserCreated.name,
      context: {
        name: userName.value,
        email: userEmail.value,
        phone: userPhone.value,
      },
    });
  }
}
