import { ApplicationException } from '@app/core';

export class LessonNotFoundException extends ApplicationException {
  constructor() {
    super(`Lesson not found`);
  }
}
