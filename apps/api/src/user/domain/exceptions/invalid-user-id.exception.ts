import { DomainException } from "@app/core";

export class InvalidUserIdException extends DomainException {
  constructor() {
    super('Invalid user ID');
  }
}