export class InvalidCommentDateException extends Error {
  constructor() {
    super(`Invalid comment date`);
  }
}