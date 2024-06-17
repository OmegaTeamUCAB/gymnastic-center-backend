import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseId, CourseImage } from '../value-objects';

export type CourseImageUpdatedEvent = DomainEvent<CourseImageUpdated>;

export class CourseImageUpdated {
  private constructor() {}
  image: string[];
  static createEvent(
    dispatcher: CourseId,
    courseImages: CourseImage[],
  ): CourseImageUpdatedEvent {
    return DomainEventFactory<CourseImageUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseImageUpdated.name,
      context: {
        image: courseImages.map((image) => image.value),
      },
    });
  }
}
