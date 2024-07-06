import { DomainException } from '@app/core';

export class QuestionNotFoundException extends DomainException {
  constructor() {
    super('Question not found');
  }
}
