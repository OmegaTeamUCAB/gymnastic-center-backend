import { DomainException } from '@app/core';

export class CourseAlreadyStartedByUserException extends DomainException {
  constructor() {
    super('Course Already Started by User');
  }
}
