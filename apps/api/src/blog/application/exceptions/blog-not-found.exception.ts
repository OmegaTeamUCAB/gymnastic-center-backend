import { ApplicationException } from '@app/core';

export class BlogNotFoundException extends ApplicationException {
  constructor() {
    super(`Blog Not Found`);
  }
}
