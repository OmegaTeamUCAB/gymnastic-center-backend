import {
  Service,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { UpdateCategoryCommand, UpdateCategoryResponse } from './types';
import { CategoryNotFoundException } from '../../exceptions';
import { Category } from '../../../domain/category';
import { CategoryName } from '../../../domain/value-objects/category-name';
import { CategoryIcon } from '../../../domain/value-objects/category-icon';
import { CategoryId } from '../../../domain/value-objects/category-id';

export class UpdateCategoryCommandHandler
  implements Service<UpdateCategoryCommand, UpdateCategoryResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: UpdateCategoryCommand,
  ): Promise<Result<UpdateCategoryResponse>> {
    const events = await this.eventStore.getEventsByStream(command.id);
    if (events.length === 0) throw new CategoryNotFoundException();
    const category = Category.loadFromHistory(new CategoryId(command.id), events);
    if (command.name) category.updateName(new CategoryName(command.name));
    if (command.icon) category.updateIcon(new CategoryIcon(command.icon));
    const newEvents = category.pullEvents();
    await this.eventStore.appendEvents(command.id, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<UpdateCategoryResponse>({
      id: command.id,
    });
  }
}
