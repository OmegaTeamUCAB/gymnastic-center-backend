import {
  MongoBlog,
  MongoComment,
  MongoUser,
} from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType, Projector } from '../../types';

@Injectable()
export class MongoCommentProjector
  implements Projector
{
  constructor(
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  async clear() {
    await this.commentModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onCommentCreated(
    event: EventType<{
      content: string;
      publisher: string;
      blog: string;
    }>,
  ) {
    const { content, publisher, blog } = event.context;
    const user = await this.userModel.findOne({ id: publisher });
    await this.commentModel.create({
      id: event.dispatcherId,
      content,
      blog,
      publisher: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      publishDate: new Date(),
      likes: [],
      dislikes: [],
    });
  }

  async onCommentLiked(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.commentModel.updateOne(
      { id: event.dispatcherId },
      { $push: { likes: user }, $inc: { numberOfLikes: 1 } },
    );
  }

  async onCommentLikeRemoved(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.commentModel.updateOne(
      { id: event.dispatcherId },
      { $pull: { likes: user }, $inc: { numberOfLikes: -1 } },
    );
  }

  async onCommentDisliked(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.commentModel.updateOne(
      { id: event.dispatcherId },
      { $push: { dislikes: user }, $inc: { numberOfDislikes: 1 } },
    );
  }

  async onCommentDislikeRemoved(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.commentModel.updateOne(
      { id: event.dispatcherId },
      { $pull: { dislikes: user }, $inc: { numberOfDislikes: -1 } },
    );
  }

  async onCommentDeleted(event: EventType<{}>) {
    const comment = await this.commentModel.findOne({
      id: event.dispatcherId,
    });
    await this.commentModel.deleteOne({ id: event.dispatcherId });
    await this.blogModel.updateOne(
      { id: comment.blog },
      { $inc: { comments: -1 } },
    );
  }

  async onUserNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.commentModel.updateMany(
      { 'publisher.id': event.dispatcherId },
      { 'publisher.name': name },
    );
  }

  async onUserImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.commentModel.updateMany(
      { 'publisher.id': event.dispatcherId },
      { 'publisher.image': image },
    );
  }
}
