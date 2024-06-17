import { DomainException } from '@app/core';

export class InvalidCourseIdException extends DomainException {
  constructor() {
    super('Invalid Course Id');
  }
}
