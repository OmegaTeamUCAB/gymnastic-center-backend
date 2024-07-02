import { DomainException } from '@app/core';

export class InvalidCourseNameException extends DomainException {
  constructor() {
    super('Invalid Course Name');
  }
}
