import { DomainException } from '@app/core';

export class InvalidUserProgressIdException extends DomainException {
  constructor() {
    super('Invalid user progress id');
  }
}
