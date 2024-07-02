import { DomainException } from '@app/core';

export class InvalidInstructorImageException extends DomainException {
  constructor() {
    super('Invalid Instructor Image');
  }
}
