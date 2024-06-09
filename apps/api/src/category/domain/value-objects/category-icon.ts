import { ValueObject } from '@app/core';
import { InvalidCategoryIconException } from '../exceptions/invalid-category-icon.exception';

export class CategoryIcon implements ValueObject<CategoryIcon> {
  constructor(private readonly _icon: string) {
    if (_icon.length === 0) throw new InvalidCategoryIconException();
  }

  get icon(): string {
    return this._icon;
  }

  equals(other: CategoryIcon): boolean {
    return this._icon === other.icon;
  }
}
