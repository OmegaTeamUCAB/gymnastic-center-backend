import { DomainException } from "@app/core";

export class InvalidQuestionContentException extends DomainException {
  constructor() {
    super('Invalid question content');
  }
}