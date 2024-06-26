import {
  Service,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { CreateCategoryCommand, CreateCategoryResponse } from './types';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { Category } from '../../../domain/category';
import { CategoryName } from '../../../domain/value-objects/category-name';
import { CategoryIcon } from '../../../domain/value-objects/category-icon';
import { CategoryId } from '../../../domain/value-objects/category-id';

export class CreateCategoryCommandHandler
  implements Service<CreateCategoryCommand, CreateCategoryResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: CreateCategoryCommand,
  ): Promise<Result<CreateCategoryResponse>> {
    const id = this.idGenerator.generateId();
    const data = {
      name: new CategoryName(command.name),
      icon: new CategoryIcon(command.icon),
    };
    const category = Category.create(new CategoryId(id), data);
    const events = category.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateCategoryResponse>({
      id,
    });
  }
}
