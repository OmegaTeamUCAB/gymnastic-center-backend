import { DomainEvent } from '@app/core';
import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import {
  BlogContent,
  BlogPublishDate,
  BlogId,
  BlogImage,
  BlogTag,
  BlogTitle,
} from '../value-objects';
import { CategoryId } from 'apps/api/src/category/domain/value-objects/category-id';
import { InstructorId } from 'apps/api/src/instructor/domain/value-objects/instructor-id';

export type BlogCreatedEvent = DomainEvent<BlogCreated>;

export class BlogCreated {
  private constructor() {}
  title: string;
  content: string;
  creationDate: Date;
  images: string[];
  tags: string[];
  category: string;
  instructor: string;
  static createEvent(
    dispatcher: BlogId,
    blogTitle: BlogTitle,
    blogContent: BlogContent,
    blogCreationDate: BlogPublishDate,
    blogImage: BlogImage[],
    blogTag: BlogTag[],
    blogCategory: CategoryId,
    blogInstructor: InstructorId,
  ): BlogCreatedEvent {
    return DomainEventFactory<BlogCreated>({
      dispatcherId: dispatcher.value,
      name: BlogCreated.name,
      context: {
        title: blogTitle.value,
        content: blogContent.value,
        creationDate: blogCreationDate.value,
        images: blogImage.map((image) => image.value),
        tags: blogTag.map((tag) => tag.value),
        category: blogCategory.value,
        instructor: blogInstructor.value,
      },
    });
  }
}
