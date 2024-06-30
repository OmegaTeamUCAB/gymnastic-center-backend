import { DomainException } from "@app/core";

export class InvalidQuestionDateException extends DomainException {
  constructor() {
    super('Invalid question date');
  }
}