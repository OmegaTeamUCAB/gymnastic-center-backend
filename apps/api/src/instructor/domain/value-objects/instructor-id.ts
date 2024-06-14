import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidInstructorException } from '../exceptions/invalid-instructor.exception';

export class InstructorId implements ValueObject<InstructorId> {
  constructor(private readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidInstructorException();
  }

  get value(): string {
    return this._id;
  }

  equals(other: InstructorId): boolean {
    return this._id === other.value;
  }
}
