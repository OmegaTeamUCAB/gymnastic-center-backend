import { ValueObject } from '@app/core';
import { InvalidAnswerContentException } from '../exceptions';

export class AnswerContent implements ValueObject<AnswerContent> {
  constructor(private readonly _content: string) {
    if (_content.length < 1 || _content.length > 255) {
      throw new InvalidAnswerContentException();
    }
  }

  get value(): string {
    return this._content;
  }

  equals(other: AnswerContent): boolean {
    return this._content === other._content;
  }
}