import { ValueObject } from "@app/core";
import { InvalidUserNameException } from "../exceptions";

export class UserName implements ValueObject<UserName> {
  constructor(private readonly _name: string) {
    if (_name.length < 2 || _name.length > 50) throw new InvalidUserNameException();
  }

  get value(): string {
    return this._name;
  }

  equals(other: UserName): boolean {
    return this._name === other._name;
  }
}