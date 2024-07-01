import { DomainEvent } from '@app/core';
import {
  QuestionContent,
  QuestionDate,
  QuestionId,
} from '../entities/questions/value-objects';
import { LessonId } from '../entities/lessons/value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import { AnswerContent, AnswerDate, AnswerId } from '../entities/answers/value-objects';
import { CourseId } from '../value-objects';

export type AnswerCreatedEvent = DomainEvent<AnswerCreated>;

export class AnswerCreated {
  private constructor() {}
  answerId: string;
  questionId: string;
  instructor: string;
  content: string;
  date: Date;
  static createEvent(
    dispatcher: CourseId,
    answerId: AnswerId,
    questionId: QuestionId,
    instructor: InstructorId,
    content: AnswerContent,
    date: AnswerDate,
  ): AnswerCreatedEvent {
    return DomainEventFactory<AnswerCreated>({
      dispatcherId: dispatcher.value,
      name: AnswerCreated.name,
      context: {
        answerId: answerId.value,
        questionId: questionId.value,
        instructor: instructor.value,
        content: content.value,
        date: date.value,
      },
    });
  }
}
