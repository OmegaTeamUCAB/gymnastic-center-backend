import { DomainException } from '@app/core';

export class InvalidLessonDescriptionException extends DomainException {
  constructor() {
    super(`Invalid Lesson Description`);
  }
}
