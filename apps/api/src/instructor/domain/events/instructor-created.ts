import { DomainEvent } from '@app/core';
import { InstructorId } from '../value-objects/instructor-id';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorName } from '../value-objects/instructor-name';
import { InstructorImage } from '../value-objects/instructor-image';
import { InstructorLocation } from '../value-objects/instructor-location';

export type InstructorCreatedEvent = DomainEvent<InstructorCreated>;

export class InstructorCreated {
  private constructor() {}
  name: string;
  image: string;
  city: string;
  country: string;
  static createEvent(
    dispatcher: InstructorId,
    instructorName: InstructorName,
    instructorImage: InstructorImage,
    instructorLocation: InstructorLocation,
  ): InstructorCreatedEvent {
    return DomainEventFactory<InstructorCreated>({
      dispatcherId: dispatcher.value,
      name: InstructorCreated.name,
      context: {
        name: instructorName.value,
        image: instructorImage.value,
        city: instructorLocation.city,
        country: instructorLocation.country,
      },
    });
  }
}
