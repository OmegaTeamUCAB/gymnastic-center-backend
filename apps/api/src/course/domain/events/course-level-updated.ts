import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseId, CourseLevel } from '../value-objects';

export type CourseLevelUpdatedEvent = DomainEvent<CourseLevelUpdated>;

export class CourseLevelUpdated {
  private constructor() {}
  level: number;
  static createEvent(
    dispatcher: CourseId,
    courseLevel: CourseLevel,
  ): CourseLevelUpdatedEvent {
    return DomainEventFactory<CourseLevelUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseLevelUpdated.name,
      context: {
        level: courseLevel.value,
      },
    });
  }
}
