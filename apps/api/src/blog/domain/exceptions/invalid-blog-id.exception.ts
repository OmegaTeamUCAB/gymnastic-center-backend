import { DomainException } from '@app/core';

export class InvalidBlogIdException extends DomainException {
  constructor() {
    super('Invalid Blog Id');
  }
}
