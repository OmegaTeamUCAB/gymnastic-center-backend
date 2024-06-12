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
  BlogContent,
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from '../../../domain/value-objects';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';

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
      images: command.images.map(image => new BlogImages(image)),
      tags: command.tags.map(tag => new BlogTags(tag)),
      title: new BlogTitle(command.title),
      category: new CategoryId(command.category),
      content: new BlogContent(command.content),
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
