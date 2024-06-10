import { ValueObject } from "@app/core";
import { InvalidInstructorNameException } from "../exceptions/invalid-instructor-name.exception";

export class InstructorName implements ValueObject<InstructorName> {
    constructor(private readonly _name: string) {
        if (_name.length < 5) throw new InvalidInstructorNameException();
    }

    get value(): string {
        return this._name;
    }

    equals(other: InstructorName): boolean {
        return this._name == other.value
    }
}