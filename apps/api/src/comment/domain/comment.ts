import { AggregateRoot, DomainEvent } from '@app/core';
import { CommentContent, CommentDate, CommentId } from './value-objects';
import { BlogId } from '../../blog/domain/value-objects';
import { UserId } from '../../user/domain/value-objects';
import {
  CommentAlreadyDislikedByException,
  CommentAlreadyLikedByException,
  CommentDoesntDislikedByException,
  CommentDoesntLikedByException,
  CommentIsntPublishedByException,
  InvalidCommentException,
} from './exceptions';
import {
  CommentCreated,
  CommentDeleted,
  CommentDislikeRemoved,
  CommentDisliked,
  CommentLikeRemoved,
  CommentLiked,
} from './events';
import { CommentDeletedException } from './exceptions/comment-deleted.exception';

export class Comment extends AggregateRoot<CommentId> {
  private constructor(id: CommentId) {
    super(id);
  }
  private _content: CommentContent;
  private _blog: BlogId;
  private _publisher: UserId;
  private _publishDate: CommentDate;
  private _likes: UserId[];
  private _dislikes: UserId[];
  private _isActive: boolean;

  protected validateState(): void {
    if (
      !this.id ||
      !this._content ||
      !this._blog ||
      !this._publisher ||
      !this._publishDate ||
      !this._likes ||
      !this._dislikes
    )
      throw new InvalidCommentException();
  }

  get content(): CommentContent {
    return this._content;
  }

  get blog(): BlogId {
    return this._blog;
  }

  get publisher(): UserId {
    return this._publisher;
  }

  get likes(): UserId[] {
    return this._likes;
  }

  get dislikes(): UserId[] {
    return this._dislikes;
  }

  isLikedBy(_user: UserId): boolean {
    return this._likes.some((user) => user.equals(_user));
  }

  isDislikedBy(_user: UserId): boolean {
    return this._dislikes.some((user) => user.equals(_user));
  }

  isActive(): boolean {
    return this._isActive;
  }

  addLike(_user: UserId): void {
    if (!this._isActive) throw new CommentDeletedException();
    if (this.isLikedBy(_user)) throw new CommentAlreadyLikedByException();
    if (this.isDislikedBy(_user)) this.removeDislike(_user);
    this.apply(CommentLiked.createEvent(this.id, _user));
  }

  removeLike(_user: UserId): void {
    if (!this._isActive) throw new CommentDeletedException();
    if (!this.isLikedBy(_user)) throw new CommentDoesntLikedByException();
    this.apply(CommentLikeRemoved.createEvent(this.id, _user));
  }

  addDislike(_user: UserId): void {
    if (!this._isActive) throw new CommentDeletedException();
    if (this.isDislikedBy(_user)) throw new CommentAlreadyDislikedByException();
    if (this.isLikedBy(_user)) this.removeLike(_user);
    this.apply(CommentDisliked.createEvent(this.id, _user));
  }

  removeDislike(_user: UserId): void {
    if (!this._isActive) throw new CommentDeletedException();
    if (!this.isDislikedBy(_user)) throw new CommentDoesntDislikedByException();
    this.apply(CommentDislikeRemoved.createEvent(this.id, _user));
  }

  delete(id: CommentId, user: UserId): void {
    if (!this._isActive) throw new CommentDeletedException();
    if (!this._publisher.equals(user))
      throw new CommentIsntPublishedByException();
    this.apply(CommentDeleted.createEvent(id));
  }

  static create(
    id: CommentId,
    data: {
      content: CommentContent;
      blog: BlogId;
      publisher: UserId;
    },
  ): Comment {
    const comment = new Comment(id);
    comment.apply(
      CommentCreated.createEvent(
        id,
        data.content,
        data.blog,
        data.publisher,
        new CommentDate(new Date()),
      ),
    );
    return comment;
  }

  static loadFromHistory(id: CommentId, events: DomainEvent[]): Comment {
    const comment = new Comment(id);
    comment.hydrate(events);
    return comment;
  }

  [`on${CommentCreated.name}`](context: CommentCreated): void {
    this._content = new CommentContent(context.content);
    this._blog = new BlogId(context.blog);
    this._publisher = new UserId(context.publisher);
    this._publishDate = new CommentDate(context.date);
    this._likes = [];
    this._dislikes = [];
    this._isActive = true;
  }

  [`on${CommentLiked.name}`](context: CommentLiked): void {
    this._likes.push(new UserId(context.user));
  }

  [`on${CommentDisliked.name}`](context: CommentDisliked): void {
    this._dislikes.push(new UserId(context.user));
  }

  [`on${CommentLikeRemoved.name}`](context: CommentLikeRemoved): void {
    this._likes = this._likes.filter(
      (user) => !user.equals(new UserId(context.user)),
    );
  }

  [`on${CommentDislikeRemoved.name}`](context: CommentDislikeRemoved): void {
    this._dislikes = this._dislikes.filter(
      (user) => !user.equals(new UserId(context.user)),
    );
  }

  [`on${CommentDeleted.name}`](): void {
    this._isActive = false;
  }
}
