import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { UpdateBlogResponse, UpdateBlogCommand } from './types';
import { BlogNotFoundException } from '../../exceptions';
import {
  BlogContent,
  BlogId,
  BlogImage,
  BlogTag,
  BlogTitle,
} from '../../../domain/value-objects';
import { Blog } from '../../../domain/blog';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';

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
    if (command.images)
      blog.updateImages(command.images.map((image) => new BlogImage(image)));
    if (command.tags)
      blog.updateTags(command.tags.map((tag) => new BlogTag(tag)));
    if (command.title) blog.updateTitle(new BlogTitle(command.title));
    if (command.category) blog.updateCategory(new CategoryId(command.category));
    if (command.content) blog.updateContent(new BlogContent(command.content));
    const newEvents = blog.pullEvents();
    await this.eventStore.appendEvents(command.id, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<UpdateBlogResponse>({
      id: command.id,
    });
  }
}
