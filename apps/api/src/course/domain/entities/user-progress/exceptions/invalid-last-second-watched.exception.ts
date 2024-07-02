import { DomainException } from '@app/core';

export class InvalidLastSecondWatchedException extends DomainException {
  constructor() {
    super('Invalid last second watched');
  }
}
