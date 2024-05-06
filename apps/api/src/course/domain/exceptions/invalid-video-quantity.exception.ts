import { DomainException } from '@app/core';

export class InvalidVideoQuantityException extends DomainException {
  constructor() {
    super(`A course must have at least one video`);
  }
}
