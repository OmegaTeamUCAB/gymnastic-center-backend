import { DomainException } from '@app/core';

export class InstructorNotFollowedException extends DomainException {
  constructor() {
    super('Instructor not followed');
  }
}
