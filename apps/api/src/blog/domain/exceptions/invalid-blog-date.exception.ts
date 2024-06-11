import { DomainException } from '@app/core';

export class InvalidBlogDateException extends DomainException {
  constructor() {
    super('Invalid Blog Date');
  }
}
