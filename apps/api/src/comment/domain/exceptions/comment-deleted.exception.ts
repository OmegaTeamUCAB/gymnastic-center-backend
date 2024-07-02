import { DomainException } from "@app/core";

export class CommentDeletedException extends DomainException {
  constructor() {
    super('The comment is deleted.');
  }
}