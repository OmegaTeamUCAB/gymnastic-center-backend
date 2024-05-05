import { DomainException } from '@app/core';

export class InvalidLessonQuantityException extends DomainException {
  constructor() {
    super(`A course must have at least one lesson`);
  }
}
