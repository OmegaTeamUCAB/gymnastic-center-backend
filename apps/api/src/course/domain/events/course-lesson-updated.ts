import { DomainEvent } from '@app/core';
import { CourseId } from '../value-objects';
import {
  LessonDescription,
  LessonTitle,
  LessonVideo,
} from '../entities/lessons/value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type CourseLessonUpdatedEvent = DomainEvent<CourseLessonUpdated>;

export class CourseLessonUpdated {
  private constructor() {}
  title: string;
  description: string;
  video: string;
  static createEvent(
    dispatcher: CourseId,
    lessonTitle: LessonTitle,
    lessonDescription: LessonDescription,
    lessonVideo: LessonVideo,
  ): CourseLessonUpdatedEvent {
    return DomainEventFactory<CourseLessonUpdated>({
      dispatcherId: dispatcher.value,
      name: CourseLessonUpdated.name,
      context: {
        title: lessonTitle.value,
        description: lessonDescription.value,
        video: lessonVideo.value,
      },
    });
  }
}
