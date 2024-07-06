import { ValueObject } from '@app/core';
import { InvalidQuestionContentException } from '../exceptions';

export class QuestionContent implements ValueObject<QuestionContent> {
  constructor(private readonly _content: string) {
    if (_content.length < 1 || _content.length > 255) {
      throw new InvalidQuestionContentException();
    }
  }

  get value(): string {
    return this._content;
  }

  equals(other: QuestionContent): boolean {
    return this._content === other._content;
  }
}