import { DomainException } from '@app/core';

export class QuestionAlreadyAnsweredException extends DomainException {
  constructor() {
    super('Question already answered');
  }
}
