import { ValueObject } from '@app/core';
import { InvalidQuestionDateException } from '../../questions/exceptions';


export class AnswerDate implements ValueObject<AnswerDate> {
  constructor(private readonly _date: Date) {
    if (this._date > new Date()) throw new InvalidQuestionDateException();
  }

  get value(): Date {
    return this._date;
  }

  equals(other: AnswerDate): boolean {
    return this._date === other.value;
  }
}