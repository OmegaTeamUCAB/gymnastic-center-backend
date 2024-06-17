import { DomainException } from '@app/core';

export class InvalidCourseWeekException extends DomainException {
  constructor() {
    super('Invalid Course Week');
  }
}
