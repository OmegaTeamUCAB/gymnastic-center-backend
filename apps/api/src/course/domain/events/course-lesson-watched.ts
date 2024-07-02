import { CourseId } from '../value-objects';
import {
  DomainEvent,
  DomainEventFactory,
} from '@app/core/domain/events/domain-event';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { LessonId } from '../entities/lessons/value-objects';
import {
  CompletionPercentage,
  LastSecondWatched,
} from '../entities/user-progress/value-objects';

export type CourseLessonWatchedEvent = DomainEvent<CourseLessonWatched>;

export class CourseLessonWatched {
  private constructor() {}
  user: string;
  lesson: string;
  completionPercentage: number;
  lastSecondWatched: number;
  static createEvent(
    dispatcher: CourseId,
    user: UserId,
    lesson: LessonId,
    completionPercentage: CompletionPercentage,
    lastSecondWatched: LastSecondWatched,
  ): CourseLessonWatchedEvent {
    return DomainEventFactory<CourseLessonWatched>({
      dispatcherId: dispatcher.value,
      name: CourseLessonWatched.name,
      context: {
        user: user.value,
        lesson: lesson.value,
        completionPercentage: completionPercentage.value,
        lastSecondWatched: lastSecondWatched.value,
      },
    });
  }
}
