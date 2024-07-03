import { DomainException } from '@app/core';

export class InvalidInstructorLocationException extends DomainException {
  constructor() {
    super('Invalid Instructor Location');
  }
}
