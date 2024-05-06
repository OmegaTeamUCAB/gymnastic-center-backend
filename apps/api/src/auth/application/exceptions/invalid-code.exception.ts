import { ApplicationException } from '@app/core';

export class InvalidCodeException extends ApplicationException {
  constructor() {
    super('Invalid verify code');
  }
}
