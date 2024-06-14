import { DomainException } from '@app/core';

export class InvalidCategoryNameException extends DomainException {
  constructor() {
    super(`Invalid Category Name`);
  }
}
