import { UUIDRegExp, ValueObject } from "@app/core";
import { InvalidAnswerIdException } from "../exceptions";

export class AnswerId implements ValueObject<AnswerId> {
  constructor(readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidAnswerIdException();
  }

  get value(): string {
    return this._id;
  }

    equals(other: AnswerId): boolean {
        return this._id === other._id;
    }
}