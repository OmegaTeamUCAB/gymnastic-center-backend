import { DomainException } from "@app/core";

export class InvalidUserNameException extends DomainException {
    constructor() {
      super('Invalid user Name');
    }
  }