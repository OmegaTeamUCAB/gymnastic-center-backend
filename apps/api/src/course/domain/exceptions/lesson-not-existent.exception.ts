import { DomainException } from '@app/core';

export class LessonNotExistentException extends DomainException {
  constructor() {
    super('Lesson not found in course');
  }
}
