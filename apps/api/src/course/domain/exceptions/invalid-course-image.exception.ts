import { DomainException } from "@app/core";

export class InvalidCourseImageException extends DomainException {
  constructor() {
    super('Invalid Course Image');
  }
}