import { DomainException } from '@app/core';

export class InvalidDirectionException extends DomainException {
  constructor() {
    super('Invalid Direction');
  }
}
