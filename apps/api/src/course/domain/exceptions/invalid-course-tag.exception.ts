import { DomainException } from '@app/core';

export class InvalidCourseTagException extends DomainException {
  constructor() {
    super('Invalid Course Tag');
  }
}
