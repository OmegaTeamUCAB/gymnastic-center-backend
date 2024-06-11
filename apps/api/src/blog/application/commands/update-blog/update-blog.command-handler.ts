import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { UpdateBlogResponse, UpdateBlogCommand } from './types';
import { BlogNotFoundException } from '../../exceptions';
import {
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from '../../../domain/value-objects';
import { Blog } from '../../../domain/blog';

export class UpdateBlogCommandHandler
  implements ApplicationService<UpdateBlogCommand, UpdateBlogResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: UpdateBlogCommand,
  ): Promise<Result<UpdateBlogResponse>> {
    const events = await this.eventStore.getEventsByStream(command.id);
    if (events.length === 0) throw new BlogNotFoundException();
    const blog = Blog.loadFromHistory(new BlogId(command.id), events);
    if (command.date) blog.updateDate(new BlogDate(command.date));
    if (command.images) blog.updateImages(new BlogImages(command.images));
    if (command.tags) blog.updateTags(new BlogTags(command.tags));
    if (command.title) blog.updateTitle(new BlogTitle(command.title));
    const newEvents = blog.pullEvents();
    await this.eventStore.appendEvents(command.id, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<UpdateBlogResponse>({
      id: command.id,
    });
  }
}
