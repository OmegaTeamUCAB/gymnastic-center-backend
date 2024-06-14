import { DomainException } from '@app/core';

export class InvalidBlogTitleException extends DomainException {
  constructor() {
    super('Invalid Blog Title');
  }
}
