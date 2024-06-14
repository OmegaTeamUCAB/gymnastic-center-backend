import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import {
  BlogContent,
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from '../value-objects';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';

export type BlogCreatedEvent = DomainEvent<BlogCreated>;

export class BlogCreated {
  private constructor() {}
  date: Date;
  images: string[];
  tags: string[];
  title: string;
  category: string;
  content: string;
  static createEvent(
    dispatcher: BlogId,
    blogDate: BlogDate,
    blogImage: BlogImages[],
    blogTag: BlogTags[],
    blogTitle: BlogTitle,
    blogCategory: CategoryId,
    blogContent: BlogContent
  ): BlogCreatedEvent {
    return DomainEventFactory<BlogCreated>({
      dispatcherId: dispatcher.value,
      name: BlogCreated.name,
      context: {
        date: blogDate.value,
        images: blogImage.map( image => image.value  ),
        tags: blogTag.map( tag => tag.value ),
        title: blogTitle.value,
        category: blogCategory.value,
        content: blogContent.value,
      },
    });
  }
}
