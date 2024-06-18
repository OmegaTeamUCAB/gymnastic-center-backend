import { DomainException } from '@app/core';

export class InvalidLessonIdException extends DomainException {
  constructor() {
    super(`Invalid Lesson Id`);
  }
}
