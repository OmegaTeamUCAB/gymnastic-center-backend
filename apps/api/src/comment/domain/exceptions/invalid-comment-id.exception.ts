import { DomainException } from "@app/core";

export class InvalidCommentIdException extends DomainException {
  constructor() {
    super('Invalid comment Id');
  }
}