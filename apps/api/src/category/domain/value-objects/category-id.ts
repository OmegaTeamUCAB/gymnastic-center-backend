import { UUIDRegExp, ValueObject } from '@app/core';
import { InvalidCategoryIdException } from '../exceptions/invalid-category-id.exception';

export class CategoryId implements ValueObject<CategoryId> {
  constructor(private readonly _id: string) {
    if (!UUIDRegExp.test(_id)) throw new InvalidCategoryIdException();
  }

  get id(): string {
    return this._id;
  }

  equals(other: CategoryId): boolean {
    return this._id === other.id;
  }
}
