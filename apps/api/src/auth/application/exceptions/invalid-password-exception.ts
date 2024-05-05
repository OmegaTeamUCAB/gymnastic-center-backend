import { ApplicationException } from '@app/core';

export class InvalidPasswordException extends ApplicationException {
  constructor() {
    super(`Invalid password`);
  }
}
