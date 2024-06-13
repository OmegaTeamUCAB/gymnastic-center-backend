import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type InstructorFollowedEvent = DomainEvent<InstructorFollowed>;

export class InstructorFollowed {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: InstructorId,
    //TODO: Cambiar a userId
    user: string,
  ): InstructorFollowedEvent {
    return DomainEventFactory<InstructorFollowed>({
      dispatcherId: dispatcher.value,
      name: InstructorFollowed.name,
      context: {
        user,
      },
    });
  }
}
