import { DomainException } from '@app/core';

export class InvalidBlogTagsException extends DomainException {
  constructor() {
    super('Invalid Blog Tags');
  }
}
