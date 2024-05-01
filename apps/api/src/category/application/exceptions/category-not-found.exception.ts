import { ApplicationException } from '@app/core';

export class CategoryNotFoundException extends ApplicationException {
  constructor() {
    super(`Category not found`);
  }
}
