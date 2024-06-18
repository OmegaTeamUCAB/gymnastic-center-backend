import { DomainException } from '@app/core';

export class InvalidLessonTitleException extends DomainException {
  constructor() {
    super(`Invalid Lesson Title`);
  }
}
