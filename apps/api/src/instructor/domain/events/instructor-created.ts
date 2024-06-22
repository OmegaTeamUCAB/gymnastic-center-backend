import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects/instructor-id';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorName } from '../value-objects/instructor-name';
import { InstructorImage } from '../value-objects/instructor-image';

export type InstructorCreatedEvent = DomainEvent<InstructorCreated>;

export class InstructorCreated {
  private constructor() {}
  name: string;
  image: string;
  static createEvent(
    dispatcher: InstructorId,
    instructorName: InstructorName,
    instructorImage: InstructorImage
  ): InstructorCreatedEvent {
    return DomainEventFactory<InstructorCreated>({
      dispatcherId: dispatcher.value,
      name: InstructorCreated.name,
      context: {
        name: instructorName.value,
        image: instructorImage.value,
      },
    });
  }
}
