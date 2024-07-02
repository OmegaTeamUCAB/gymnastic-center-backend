import { DomainException } from '@app/core';

export class InvalidBlogImagesException extends DomainException {
  constructor() {
    super('Invalid Blog Images');
  }
}
