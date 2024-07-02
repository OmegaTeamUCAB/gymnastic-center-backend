import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects/instructor-id';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorImage } from '../value-objects/instructor-image';

export type InstructorImageUpdatedEvent = DomainEvent<InstructorImageUpdated>;

export class InstructorImageUpdated {
  private constructor() {}
  image: string;
  static createEvent(
    dispatcher: InstructorId,
    instructorImage: InstructorImage,
  ): InstructorImageUpdatedEvent {
    return DomainEventFactory<InstructorImageUpdated>({
      dispatcherId: dispatcher.value,
      name: InstructorImageUpdated.name,
      context: {
        image: instructorImage.value,
      },
    });
  }
}
