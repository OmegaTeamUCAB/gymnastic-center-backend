import { InvalidLastSecondWatchedException } from '../exceptions';

export class LastSecondWatched {
  constructor(private _value: number) {
    if (_value < 0) throw new InvalidLastSecondWatchedException();
  }

  get value(): number {
    return this._value;
  }

  equals(other: LastSecondWatched): boolean {
    return this._value === other.value;
  }

  static initial(): LastSecondWatched {
    return new LastSecondWatched(0);
  }
}
