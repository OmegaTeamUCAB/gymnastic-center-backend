import { DomainEvent } from '@app/core';
import {
  QuestionContent,
  QuestionDate,
  QuestionId,
} from '../entities/questions/value-objects';
import { LessonId } from '../entities/lessons/value-objects';
import { UserId } from 'apps/api/src/user/domain/value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { CourseId } from '../value-objects';

export type QuestionCreatedEvent = DomainEvent<QuestionCreated>;

export class QuestionCreated {
  private constructor() {}
  questionId: string;
  user: string;
  lesson: string;
  content: string;
  date: Date;
  static createEvent(
    dispatcher: CourseId,
    questionId: QuestionId,
    user: UserId,
    lesson: LessonId,
    content: QuestionContent,
    date: QuestionDate,
  ): QuestionCreatedEvent {
    return DomainEventFactory<QuestionCreated>({
      dispatcherId: dispatcher.value,
      name: QuestionCreated.name,
      context: {
        questionId: questionId.value,
        user: user.value,
        lesson: lesson.value,
        content: content.value,
        date: date.value,
      },
    });
  }
}
