import { DomainException } from "@app/core";

export class InvalidUserEmailException extends DomainException {
  constructor() {
    super('Invalid user email');
  }
}