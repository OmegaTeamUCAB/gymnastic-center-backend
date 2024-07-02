import { DomainEvent } from '@app/core';
import { BlogId, BlogImage } from '../value-objects';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';

export type BlogImagesUpdatedEvent = DomainEvent<BlogImagesUpdated>;

export class BlogImagesUpdated {
  private constructor() {}
  images: string[];
  static createEvent(
    dispatcher: BlogId,
    blogImages: BlogImage[],
  ): BlogImagesUpdatedEvent {
    return DomainEventFactory<BlogImagesUpdated>({
      dispatcherId: dispatcher.value,
      name: BlogImagesUpdated.name,
      context: {
        images: blogImages.map((image) => image.value),
      },
    });
  }
}
