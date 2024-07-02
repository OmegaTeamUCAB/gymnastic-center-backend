import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseId, CourseName } from '../value-objects';

export type CourseNameUpdatedEvent = DomainEvent<CourseNameUpdated>;

export class CourseNameUpdated {
  private constructor() {}
  name: string;
  static createEvent(
    dispatcher: CourseId,
    courseName: CourseName,
  ): CourseNameUpdatedEvent {
    return DomainEventFactory<CourseNameUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseNameUpdated.name,
      context: {
        name: courseName.value,
      },
    });
  }
}
