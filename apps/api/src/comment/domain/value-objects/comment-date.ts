import { ValueObject } from '@app/core';
import { InvalidCommentDateException } from '../exceptions/invalid-comment-date.exception';

export class CommentDate implements ValueObject<CommentDate> {
  constructor(private readonly _date: Date) {
    if (this._date > new Date()) throw new InvalidCommentDateException();
  }

  get value(): Date {
    return this._date;
  }

  equals(other: CommentDate): boolean {
    return this._date === other.value;
  }
}
