import { AggregateRoot, DomainEvent } from '@app/core';
import {
  BlogDate,
  BlogId,
  BlogImages,
  BlogTags,
  BlogTitle,
} from './value-objects';
import { InvalidBlogException } from './exceptions';
import {
  BlogCreated,
  BlogDateUpdated,
  BlogImagesUpdated,
  BlogTagsUpdated,
  BlogTitleUpdated,
} from './events';

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
  private _images: BlogImages;
  private _tags: BlogTags;
  private _title: BlogTitle;

  get date(): BlogDate {
    return this._date;
  }

  get images(): BlogImages {
    return this._images;
  }

  get tags(): BlogTags {
    return this._tags;
  }

  get title(): BlogTitle {
    return this._title;
  }

  updateDate(date: BlogDate): void {
    this.apply(BlogDateUpdated.createEvent(this.id, date));
  }

  updateImages(images: BlogImages): void {
    this.apply(BlogImagesUpdated.createEvent(this.id, images));
  }

  updateTags(tags: BlogTags): void {
    this.apply(BlogTagsUpdated.createEvent(this.id, tags));
  }

  updateTitle(title: BlogTitle): void {
    this.apply(BlogTitleUpdated.createEvent(this.id, title));
  }

  static create(
    id: BlogId,
    data: {
      date: BlogDate;
      images: BlogImages;
      tags: BlogTags;
      title: BlogTitle;
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
    this._images = new BlogImages(context.images);
    this._tags = new BlogTags(context.tags);
    this._title = new BlogTitle(context.title);
  }

  [`on${BlogDateUpdated.name}`](context: BlogDateUpdated): void {
    this._date = new BlogDate(context.date);
  }

  [`on${BlogImagesUpdated.name}`](context: BlogImagesUpdated): void {
    this._images = new BlogImages(context.images);
  }

  [`on${BlogTagsUpdated.name}`](context: BlogTagsUpdated): void {
    this._tags = new BlogTags(context.tags);
  }

  [`on${BlogTitleUpdated.name}`](context: BlogTitleUpdated): void {
    this._title = new BlogTitle(context.title);
  }
}
