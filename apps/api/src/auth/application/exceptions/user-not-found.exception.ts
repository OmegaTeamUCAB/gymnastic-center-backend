import { ApplicationException } from '@app/core';

export class UserNotFound extends ApplicationException {
  constructor() {
    super(`User not found`);
  }
}
