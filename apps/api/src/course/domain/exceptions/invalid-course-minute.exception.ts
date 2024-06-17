import { DomainException } from "@app/core";

export class InvalidCourseMinuteException extends DomainException {
  constructor() {
    super('Invalid Course Minute');
  }
}