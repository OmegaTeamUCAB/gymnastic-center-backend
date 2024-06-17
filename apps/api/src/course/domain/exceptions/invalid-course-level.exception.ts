import { DomainException } from '@app/core';

export class InvalidCourseLevelException extends DomainException {
  constructor() {
    super('Invalid Course Level');
  }
}
