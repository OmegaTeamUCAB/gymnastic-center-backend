import { DomainException } from '@app/core';

export class InvalidLessonVideoException extends DomainException {
  constructor() {
    super(`Invalid Video Description`);
  }
}
