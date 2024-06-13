import { AggregateRoot, DomainEvent } from '@app/core';
import { CategoryId } from './value-objects/category-id';
import {
  CategoryCreated,
} from './events/category-created';
import { CategoryName } from './value-objects/category-name';
import { CategoryIcon } from './value-objects/category-icon';
import { CategoryNameUpdated } from './events/category-name-updated';
import { CategoryIconUpdated } from './events/category-icon-updated';
import { InvalidCategoryException } from './exceptions/invalid-category-exception';

export class Category extends AggregateRoot<CategoryId> {
  private constructor(id: CategoryId) {
    super(id);
  }

  protected validateState(): void {
    if (!this.id || !this._name || !this._icon) {
      throw new InvalidCategoryException();
    }
  }

  private _name: CategoryName;
  private _icon: CategoryIcon;

  get name(): CategoryName {
    return this._name;
  }

  get icon(): CategoryIcon {
    return this._icon;
  }

  updateName(name: CategoryName): void {
    this.apply(CategoryNameUpdated.createEvent(this.id, name));
  }

  updateIcon(icon: CategoryIcon): void {
    this.apply(CategoryIconUpdated.createEvent(this.id, icon));
  }

  static create(
    id: CategoryId,
    data: { 
      name: CategoryName;
      icon: CategoryIcon;
    },
  ): Category {
    const category = new Category(id);
    category.apply(CategoryCreated.createEvent(id, data.name, data.icon));
    return category;
  }
 
  static loadFromHistory(id: CategoryId, events: DomainEvent[]): Category {
    const category = new Category(id);
    category.hydrate(events);
    return category;
  }

  [`on${CategoryCreated.name}`](context: CategoryCreated): void {
    this._name = new CategoryName(context.name);
    this._icon = new CategoryIcon(context.icon);
  }

  [`on${CategoryNameUpdated.name}`](context: CategoryNameUpdated): void {
    this._name = new CategoryName(context.name);
  }

  [`on${CategoryIconUpdated.name}`](context: CategoryIconUpdated): void {
    this._icon = new CategoryIcon(context.icon);
  }
}
