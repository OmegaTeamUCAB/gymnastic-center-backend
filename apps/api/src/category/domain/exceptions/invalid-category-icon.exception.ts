import { DomainException } from '@app/core';

export class InvalidCategoryIconException extends DomainException {
  constructor() {
    super(`Invalid Category Icon`);
  }
}
