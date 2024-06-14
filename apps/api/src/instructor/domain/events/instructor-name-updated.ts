import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects/instructor-id';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorName } from '../value-objects/instructor-name';

export type InstructorNameUpdatedEvent = DomainEvent<InstructorNameUpdated>;

export class InstructorNameUpdated {
  private constructor() {}
  name: string;
  static createEvent(
    dispatcher: InstructorId,
    instructorName: InstructorName,
  ): InstructorNameUpdatedEvent {
    return DomainEventFactory<InstructorNameUpdated>({
      dispatcherId: dispatcher.value,
      name: InstructorNameUpdated.name,
      context: {
        name: instructorName.value,
      },
    });
  }
}
