import { DomainException } from '@app/core';

export class InvalidCountryException extends DomainException {
  constructor() {
    super('Invalid Country');
  }
}
