import { ApplicationException } from '@app/core';

export class InvalidPass extends ApplicationException {
  constructor() {
    super(`Invalid password`);
  }
}