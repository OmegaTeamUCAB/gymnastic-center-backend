import { DomainException } from '@app/core';

export class InvalidInstructorFollowersException extends DomainException {
  constructor() {
    super('Invalid Instructor Followers');
  }
}
