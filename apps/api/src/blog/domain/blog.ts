import { AggregateRoot, DomainEvent } from '@app/core';
import {
  BlogContent,
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from './value-objects';
import { InvalidBlogException } from './exceptions';
import {
  BlogCategoryUpdated,
  BlogContentUpdated,
  BlogCreated,
  BlogDateUpdated,
  BlogImagesUpdated,
  BlogTagsUpdated,
  BlogTitleUpdated,
} from './events';
import { CategoryId } from '../../category/domain/value-objects/category-id';

export class Blog extends AggregateRoot<BlogId> {
  private constructor(id: BlogId) {
    super(id);
  }

  protected validateState(): void {
    if (!this._date || !this._images || !this._tags || !this.title) {
      throw new InvalidBlogException();
    }
  }

  private _date: BlogDate;
  private _images: BlogImages[];
  private _tags: BlogTags[];
  private _title: BlogTitle;
  private _category: CategoryId;
  private _content: BlogContent;

  get date(): BlogDate {
    return this._date;
  }

  get images(): BlogImages[] {
    return this._images;
  }

  get tags(): BlogTags[] {
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

  updateDate(date: BlogDate): void {
    this.apply(BlogDateUpdated.createEvent(this.id, date));
  }

  updateImages(images: BlogImages[]): void {
    this.apply(BlogImagesUpdated.createEvent(this.id, images));
  }

  updateTags(tags: BlogTags[]): void {
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
      date: BlogDate;
      images: BlogImages[];
      tags: BlogTags[];
      title: BlogTitle;
      category: CategoryId;
      content: BlogContent;
    },
  ): Blog {
    const blog = new Blog(id);
    blog.apply(
      BlogCreated.createEvent(
        id,
        data.date,
        data.images,
        data.tags,
        data.title,
        data.category,
        data.content,
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
    this._date = new BlogDate(context.date);
    this._images = context.images.map((image) => new BlogImages(image));
    this._tags = context.tags.map((tag) => new BlogTags(tag));
    this._title = new BlogTitle(context.title);
    this._category = new CategoryId(context.category);
    this._content = new BlogContent(context.content);
  }

  [`on${BlogDateUpdated.name}`](context: BlogDateUpdated): void {
    this._date = new BlogDate(context.date);
  }

  [`on${BlogImagesUpdated.name}`](context: BlogImagesUpdated): void {
    this._images = context.images.map((image) => new BlogImages(image));
  }

  [`on${BlogTagsUpdated.name}`](context: BlogTagsUpdated): void {
    this._tags = context.tags.map((tag) => new BlogTags(tag));
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
