import { DomainException } from '@app/core';

export class InvalidCourseDurationException extends DomainException {
  constructor() {
    super(`Invalid Course Duration`);
  }
}
