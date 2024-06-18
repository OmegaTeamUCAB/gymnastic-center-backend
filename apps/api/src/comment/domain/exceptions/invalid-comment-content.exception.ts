import { DomainException } from "@app/core";

export class InvalidCommentContentException extends DomainException {
  constructor() {
    super('Comment content must be between 1 and 500 characters');
  }
}