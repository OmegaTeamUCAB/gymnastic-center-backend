import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseId, CourseMinute } from '../value-objects';

export type CourseMinutesUpdatedEvent = DomainEvent<CourseMinutesUpdated>;

export class CourseMinutesUpdated {
  private constructor() {}
  minutes: number;
  static createEvent(
    dispatcher: CourseId,
    courseMinutes: CourseMinute,
  ): CourseMinutesUpdatedEvent {
    return DomainEventFactory<CourseMinutesUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseMinutesUpdated.name,
      context: {
        minutes: courseMinutes.value,
      },
    });
  }
}
