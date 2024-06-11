import { DomainException } from '@app/core';

export class InvalidBlogException extends DomainException {
  constructor() {
    super('Invalid Blog');
  }
}
