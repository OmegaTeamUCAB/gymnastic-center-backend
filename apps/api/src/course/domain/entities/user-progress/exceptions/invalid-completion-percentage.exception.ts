import { DomainException } from '@app/core';

export class InvalidCompletionPercentageException extends DomainException {
  constructor() {
    super('Invalid completion percentage');
  }
}
