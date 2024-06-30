import { ValueObject } from '@app/core';
import { InvalidQuestionDateException } from '../exceptions';

export class QuestionDate implements ValueObject<QuestionDate> {
  constructor(private readonly _date: Date) {
    if (this._date > new Date()) throw new InvalidQuestionDateException();
  }

  get value(): Date {
    return this._date;
  }

  equals(other: QuestionDate): boolean {
    return this._date === other.value;
  }
}