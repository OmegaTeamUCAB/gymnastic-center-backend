import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseDuration, CourseId } from '../value-objects';

export type CourseDurationUpdatedEvent = DomainEvent<CourseDurationUpdated>;

export class CourseDurationUpdated {
  private constructor() {}
  duration: CourseDuration;
  static createEvent(
    dispatcher: CourseId,
    duration: CourseDuration,
  ): CourseDurationUpdatedEvent {
    return DomainEventFactory<CourseDurationUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseDurationUpdated.name,
      context: {
        duration: duration,
      },
    });
  }
}
