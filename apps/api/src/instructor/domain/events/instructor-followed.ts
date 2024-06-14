import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorId } from '../value-objects/instructor-id';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type InstructorFollowedEvent = DomainEvent<InstructorFollowed>;

export class InstructorFollowed {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: InstructorId,
    user: UserId,
  ): InstructorFollowedEvent {
    return DomainEventFactory<InstructorFollowed>({
      dispatcherId: dispatcher.value,
      name: InstructorFollowed.name,
      context: {
        user: user.value,
      },
    });
  }
}
