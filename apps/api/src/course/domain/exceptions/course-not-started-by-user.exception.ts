import { DomainException } from '@app/core';

export class CourseNotStartedByUserException extends DomainException {
  constructor() {
    super('Course not started by user');
  }
}
