import { ValueObject } from '@app/core';
import { InvalidCategoryNameException } from '../exceptions/invalid-category-name.exception';

export class CategoryName implements ValueObject<CategoryName> {
  constructor(private readonly _name: string) {
    if (_name.length < 4) throw new InvalidCategoryNameException();
  }

  get value(): string {
    return this._name;
  }

  equals(other: CategoryName): boolean {
    return this._name === other.value;
  }
}
