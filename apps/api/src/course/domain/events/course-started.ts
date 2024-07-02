import { CourseId } from '../value-objects';
import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { UserId } from 'apps/api/src/user/domain/value-objects';

export type CourseStartedEvent = DomainEvent<CourseStarted>;

export class CourseStarted {
  private constructor() {}
  user: string;
  static createEvent(dispatcher: CourseId, user: UserId): CourseStartedEvent {
    return DomainEventFactory<CourseStarted>({
      dispatcherId: dispatcher.value,
      name: CourseStarted.name,
      context: {
        user: user.value,
      },
    });
  }
}
