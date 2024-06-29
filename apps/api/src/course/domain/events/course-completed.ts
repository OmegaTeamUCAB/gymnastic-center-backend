import { CourseId } from '../value-objects';
import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type CourseCompletedEvent = DomainEvent<CourseCompleted>;

export class CourseCompleted {
  private constructor() {}
  user: string;
  static createEvent(dispatcher: CourseId, user: UserId): CourseCompletedEvent {
    return DomainEventFactory<CourseCompleted>({
      dispatcherId: dispatcher.value,
      name: CourseCompleted.name,
      context: {
        user: user.value,
      },
    });
  }
}
