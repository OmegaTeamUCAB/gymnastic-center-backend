import { DomainException } from "@app/core";

export class InvalidCourseDescriptionException extends DomainException {
  constructor() {
    super('Invalid Course Description');
  }
}