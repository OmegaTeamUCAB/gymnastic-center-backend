import { DomainException } from '@app/core';

export class InvalidCityException extends DomainException {
  constructor() {
    super('Invalid City');
  }
}
