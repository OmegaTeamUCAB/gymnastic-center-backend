import { DomainEvent } from '@app/core';
import { QuestionId } from '../entities/questions/value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import {
  AnswerContent,
  AnswerDate,
  AnswerId,
} from '../entities/answers/value-objects';
import { CourseId } from '../value-objects';

export type QuestionAnsweredEvent = DomainEvent<QuestionAnswered>;

export class QuestionAnswered {
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
  ): QuestionAnsweredEvent {
    return DomainEventFactory<QuestionAnswered>({
      dispatcherId: dispatcher.value,
      name: QuestionAnswered.name,
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
