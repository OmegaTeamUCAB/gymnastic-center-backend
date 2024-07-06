import { DomainException } from "@app/core";

export class InvalidQuestionIdException extends DomainException {
  constructor() {
    super('Invalid user question id');
  }
}