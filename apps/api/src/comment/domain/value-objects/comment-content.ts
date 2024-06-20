import { ValueObject } from '@app/core';
import { InvalidCommentContentException } from '../exceptions';

export class CommentContent implements ValueObject<CommentContent> {
  constructor(private readonly _content: string) {
    if (_content.length < 1 || _content.length > 255) {
      throw new InvalidCommentContentException();
    }
  }

  get value(): string {
    return this._content;
  }

  equals(other: CommentContent): boolean {
    return this._content === other._content;
  }
}
