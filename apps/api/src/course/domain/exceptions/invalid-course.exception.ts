import { DomainException } from '@app/core';

export class InvalidCourseException extends DomainException {
  constructor() {
    super('Invalid Course');
  }
}
