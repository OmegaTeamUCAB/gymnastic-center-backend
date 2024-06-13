import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type InstructorUnfollowedEvent = DomainEvent<InstructorUnfollowed>;

export class InstructorUnfollowed {
  private constructor() {}
  user: string;
  static createEvent(
    dispatcher: InstructorId,
    //TODO: Cambiar a userId
    user: string,
  ): InstructorUnfollowedEvent {
    return DomainEventFactory<InstructorUnfollowed>({
      dispatcherId: dispatcher.value,
      name: InstructorUnfollowed.name,
      context: {
        user,
      },
    });
  }
}
