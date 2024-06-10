import { DomainException } from '@app/core';

export class InvalidCategoryException extends DomainException {
  constructor() {
    super('Invalid Category');
  }
}
