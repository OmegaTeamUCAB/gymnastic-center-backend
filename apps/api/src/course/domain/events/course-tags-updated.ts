import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { CourseId, CourseTag } from '../value-objects';

export type CourseTagsUpdatedEvent = DomainEvent<CourseTagsUpdated>;

export class CourseTagsUpdated {
  private constructor() {}
  tags: string[];
  static createEvent(
    dispatcher: CourseId,
    courseTags: CourseTag[],
  ): CourseTagsUpdatedEvent {
    return DomainEventFactory<CourseTagsUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseTagsUpdated.name,
      context: {
        tags: courseTags.map((tag) => tag.value),
      },
    });
  }
}
