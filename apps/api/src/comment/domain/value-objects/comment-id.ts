import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidCommentIdException } from '../exceptions';

export class CommentId implements ValueObject<CommentId> {
  constructor(private readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidCommentIdException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: CommentId): boolean {
    return this._id === other._id;
  }
}
