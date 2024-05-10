import { ApplicationException } from '@app/core';

export class CourseNotFoundException extends ApplicationException {
  constructor() {
    super(`Course not found`);
  }
}
