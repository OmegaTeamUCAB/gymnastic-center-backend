import { DomainException } from '@app/core';

export class InvalidInstructorUserFollowException extends DomainException {
  constructor() {
    super(`Invalid Instructor User Follow`);
  }
}
