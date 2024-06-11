import { DomainException } from '@app/core';

export class InvalidAddressException extends DomainException {
  constructor() {
    super('Invalid Address');
  }
}
