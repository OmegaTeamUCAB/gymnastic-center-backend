import { ApplicationException } from '@app/core';

export class InstructorNotFoundException extends ApplicationException {
  constructor() {
    super('Instructor not found');
  }
}
