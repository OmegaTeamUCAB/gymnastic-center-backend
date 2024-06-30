import { DomainException } from "@app/core";

export class InvalidAnswerContentException extends DomainException {
  constructor() {
    super('Invalid answer content');
  }
}