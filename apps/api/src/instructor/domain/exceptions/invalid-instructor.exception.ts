import { DomainException } from '@app/core';

export class InvalidInstructorException extends DomainException {
  constructor() {
    super('Invalid Instructor');
  }
}
