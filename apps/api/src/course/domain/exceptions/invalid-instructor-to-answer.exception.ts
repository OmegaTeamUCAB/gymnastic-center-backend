import { DomainException } from "@app/core";

export class InvalidInstructorToAnswerException extends DomainException {
  constructor() {
    super('This instructor cannot answer this question');
  }
}