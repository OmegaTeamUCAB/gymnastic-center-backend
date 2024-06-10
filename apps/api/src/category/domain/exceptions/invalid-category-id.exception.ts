import { DomainException } from '@app/core';

export class InvalidCategoryIdException extends DomainException {
  constructor() {
    super(`Invalid Category ID`);
  }
}
