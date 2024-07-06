import { ValueObject } from '@app/core';
import { InvalidCompletionPercentageException } from '../exceptions';

export class CompletionPercentage implements ValueObject<CompletionPercentage> {
  constructor(private _value: number) {
    if (_value < 0 || _value > 100)
      throw new InvalidCompletionPercentageException();
  }

  get value(): number {
    return this._value;
  }

  equals(other: CompletionPercentage): boolean {
    return this._value === other.value;
  }

  static completed(): CompletionPercentage {
    return new CompletionPercentage(100);
  }

  static initial(): CompletionPercentage {
    return new CompletionPercentage(0);
  }
}
