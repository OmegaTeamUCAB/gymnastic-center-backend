import { ApplicationException } from '@app/core';

export class CodeExpiredException extends ApplicationException {
  constructor() {
    super('Code expired');
  }
}
