import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseId, CourseWeek } from '../value-objects';

export type CourseWeeksUpdatedEvent = DomainEvent<CourseWeeksUpdated>;

export class CourseWeeksUpdated {
  private constructor() {}
  weeks: number;
  static createEvent(
    dispatcher: CourseId,
    courseWeeks: CourseWeek,
  ): CourseWeeksUpdatedEvent {
    return DomainEventFactory<CourseWeeksUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseWeeksUpdated.name,
      context: {
        weeks: courseWeeks.value,
      },
    });
  }
}
