import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseDescription, CourseId } from '../value-objects';

export type CourseDescriptionUpdatedEvent =
  DomainEvent<CourseDescriptionUpdated>;

export class CourseDescriptionUpdated {
  private constructor() {}
  description: string;
  static createEvent(
    dispatcher: CourseId,
    courseDescription: CourseDescription,
  ): CourseDescriptionUpdatedEvent {
    return DomainEventFactory<CourseDescriptionUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseDescriptionUpdated.name,
      context: {
        description: courseDescription.value,
      },
    });
  }
}
