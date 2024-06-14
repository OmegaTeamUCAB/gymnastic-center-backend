import { DomainException } from '@app/core';

export class InstructorAlreadyFollowedException extends DomainException {
  constructor() {
    super('Instructor already followed');
  }
}
