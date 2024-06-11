import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import {
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from '../value-objects';

export type BlogCreatedEvent = DomainEvent<BlogCreated>;

export class BlogCreated {
  private constructor() {}
  date: Date;
  images: string[];
  tags: string[];
  title: string;
  static createEvent(
    dispatcher: BlogId,
    blogDate: BlogDate,
    blogImages: BlogImages,
    blogTags: BlogTags,
    blogTitle: BlogTitle,
  ): BlogCreatedEvent {
    return DomainEventFactory<BlogCreated>({
      dispatcherId: dispatcher.value,
      name: BlogCreated.name,
      context: {
        date: blogDate.value,
        images: blogImages.value,
        tags: blogTags.value,
        title: blogTitle.value,
      },
    });
  }
}
