import { DomainException } from "@app/core";

export class InvalidUserImageException extends DomainException {
  constructor() {
    super('Invalid user image');
  }
}