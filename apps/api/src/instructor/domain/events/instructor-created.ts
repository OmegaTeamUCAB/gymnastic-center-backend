import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects/instructor-id';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorName } from '../value-objects/instructor-name';

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
