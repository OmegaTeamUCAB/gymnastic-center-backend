import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { IdGenerator } from '@app/core';
import { CreateBlogCommand, CreateBlogResponse } from './types';
import { Blog } from '../../../domain/blog';
import {
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from '../../../domain/value-objects';

export class CreateBlogCommandHandler
  implements ApplicationService<CreateBlogCommand, CreateBlogResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: CreateBlogCommand,
  ): Promise<Result<CreateBlogResponse>> {
    const id = this.idGenerator.generateId();
    const data = {
      date: new BlogDate(command.date),
      images: new BlogImages(command.images),
      tags: new BlogTags(command.tags),
      title: new BlogTitle(command.title),
    };
    const blog = Blog.create(new BlogId(id), data);
    const events = blog.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateBlogResponse>({
      id,
    });
  }
}
