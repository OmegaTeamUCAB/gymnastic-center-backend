import { AggregateRoot, DomainEvent } from '@app/core';
import {
  BlogContent,
  BlogPublishDate,
  BlogId,
  BlogImage,
  BlogTag,
  BlogTitle,
} from './value-objects';
import { InvalidBlogException } from './exceptions';
import {
  BlogCategoryUpdated,
  BlogContentUpdated,
  BlogCreated,
  BlogImagesUpdated,
  BlogTagsUpdated,
  BlogTitleUpdated,
} from './events';
import { CategoryId } from '../../category/domain/value-objects/category-id';
import { InstructorId } from '../../instructor/domain/value-objects/instructor-id';

export class Blog extends AggregateRoot<BlogId> {
  private constructor(id: BlogId) {
    super(id);
  }

  protected validateState(): void {
    if (
      !this._publishDate ||
      !this._images ||
      !this._tags ||
      !this._title ||
      !this._category ||
      !this._content ||
      !this._instructor ||
      this.images.length === 0
    ) {
      throw new InvalidBlogException();
    }
  }

  private _title: BlogTitle;
  private _content: BlogContent;
  private _publishDate: BlogPublishDate;
  private _images: BlogImage[];
  private _tags: BlogTag[];
  private _category: CategoryId;
  private _instructor: InstructorId;

  get publishDate(): BlogPublishDate {
    return this._publishDate;
  }

  get images(): BlogImage[] {
    return this._images;
  }

  get tags(): BlogTag[] {
    return this._tags;
  }

  get title(): BlogTitle {
    return this._title;
  }

  get category(): CategoryId {
    return this._category;
  }

  get content(): BlogContent {
    return this._content;
  }

  get instructor(): InstructorId {
    return this._instructor;
  }

  updateImages(images: BlogImage[]): void {
    this.apply(BlogImagesUpdated.createEvent(this.id, images));
  }

  updateTags(tags: BlogTag[]): void {
    this.apply(BlogTagsUpdated.createEvent(this.id, tags));
  }

  updateTitle(title: BlogTitle): void {
    this.apply(BlogTitleUpdated.createEvent(this.id, title));
  }

  updateCategory(category: CategoryId): void {
    this.apply(BlogCategoryUpdated.createEvent(this.id, category));
  }

  updateContent(content: BlogContent): void {
    this.apply(BlogContentUpdated.createEvent(this.id, content));
  }

  static create(
    id: BlogId,
    data: {
      title: BlogTitle;
      content: BlogContent;
      images: BlogImage[];
      tags: BlogTag[];
      category: CategoryId;
      instructor: InstructorId;
    },
  ): Blog {
    const blog = new Blog(id);
    blog.apply(
      BlogCreated.createEvent(
        id,
        data.title,
        data.content,
        new BlogPublishDate(new Date()),
        data.images,
        data.tags,
        data.category,
        data.instructor,
      ),
    );
    return blog;
  }

  static loadFromHistory(id: BlogId, events: DomainEvent[]): Blog {
    const blog = new Blog(id);
    blog.hydrate(events);
    return blog;
  }

  [`on${BlogCreated.name}`](context: BlogCreated): void {
    this._title = new BlogTitle(context.title);
    this._content = new BlogContent(context.content);
    this._publishDate = new BlogPublishDate(context.creationDate);
    this._images = context.images.map((image) => new BlogImage(image));
    this._tags = context.tags.map((tag) => new BlogTag(tag));
    this._category = new CategoryId(context.category);
    this._instructor = new InstructorId(context.instructor);
  }

  [`on${BlogImagesUpdated.name}`](context: BlogImagesUpdated): void {
    this._images = context.images.map((image) => new BlogImage(image));
  }

  [`on${BlogTagsUpdated.name}`](context: BlogTagsUpdated): void {
    this._tags = context.tags.map((tag) => new BlogTag(tag));
  }

  [`on${BlogTitleUpdated.name}`](context: BlogTitleUpdated): void {
    this._title = new BlogTitle(context.title);
  }

  [`on${BlogCategoryUpdated.name}`](context: BlogCategoryUpdated): void {
    this._category = new CategoryId(context.category);
  }

  [`on${BlogContentUpdated.name}`](context: BlogContentUpdated): void {
    this._content = new BlogContent(context.content);
  }
}
