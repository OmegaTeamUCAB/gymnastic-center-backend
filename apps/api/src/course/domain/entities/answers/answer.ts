import { Entity } from '@app/core';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';
import { AnswerContent, AnswerDate, AnswerId } from './value-objects';
import { LessonId } from '../lessons/value-objects';
import { QuestionId } from '../questions/value-objects';

export class Answer extends Entity<AnswerId> {
  constructor(
    id: AnswerId,
    protected _question: QuestionId,
    protected _instructor: InstructorId,
    protected _content: AnswerContent,
    protected _date: AnswerDate,
  ) {
    super(id);
  }

  get instructor() {
    return this._instructor;
  }

  get content() {
    return this._content;
  }

  get date() {
    return this._date;
  }

  get question() {
    return this._question;
  }

  set content(content: AnswerContent) {
    this._content = content;
  }
}
