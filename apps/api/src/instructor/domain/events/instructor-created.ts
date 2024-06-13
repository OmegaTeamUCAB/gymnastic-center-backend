import { DomainEvent } from '@app/core';
import { InstructorId, InstructorName } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type InstructorCreatedEvent = DomainEvent<InstructorCreated>;

export class InstructorCreated {
  private constructor() {}
  name: string;
  static createEvent(
    dispatcher: InstructorId,
    instructorName: InstructorName,
  ): InstructorCreatedEvent {
    console.log('DISPATCHER: ', dispatcher.value);
    return DomainEventFactory<InstructorCreated>({
      dispatcherId: dispatcher.value,
      name: InstructorCreated.name,
      context: {
        name: instructorName.value,
      },
    });
  }
}
