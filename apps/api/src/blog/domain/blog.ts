import { AggregateRoot, DomainEvent } from '@app/core';
import {
  BlogContent,
  BlogCreationDate,
  BlogId,
  BlogImages,
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
      !this._creationDate ||
      !this._images ||
      this.images.length === 0 ||
      !this._tags ||
      !this._title ||
      !this._category ||
      !this._content ||
      !this._instructor
    ) {
      throw new InvalidBlogException();
    }
  }

  private _creationDate: BlogCreationDate;
  private _images: BlogImages[];
  private _tags: BlogTag[];
  private _title: BlogTitle;
  private _category: CategoryId;
  private _content: BlogContent;
  private _instructor: InstructorId;

  get creationDate(): BlogCreationDate {
    return this._creationDate;
  }

  get images(): BlogImages[] {
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

  updateImages(images: BlogImages[]): void {
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
      creationDate: BlogCreationDate;
      images: BlogImages[];
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
        data.creationDate,
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
    this._creationDate = new BlogCreationDate(context.creationDate);
    this._images = context.images.map((image) => new BlogImages(image));
    this._tags = context.tags.map((tag) => new BlogTag(tag));
    this._category = new CategoryId(context.category);
    this._instructor = new InstructorId(context.instructor);
  }

  [`on${BlogImagesUpdated.name}`](context: BlogImagesUpdated): void {
    this._images = context.images.map((image) => new BlogImages(image));
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
