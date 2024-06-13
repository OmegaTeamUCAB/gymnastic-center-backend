import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type InstructorUnfollowedEvent = DomainEvent<InstructorUnfollowed>;

export class InstructorUnfollowed {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: InstructorId,
    user: UserId,
  ): InstructorUnfollowedEvent {
    return DomainEventFactory<InstructorUnfollowed>({
      dispatcherId: dispatcher.value,
      name: InstructorUnfollowed.name,
      context: {
        user: user.value,
      },
    });
  }
}
