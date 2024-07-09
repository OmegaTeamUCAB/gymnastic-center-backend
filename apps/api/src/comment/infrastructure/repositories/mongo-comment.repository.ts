import { InjectModel } from '@nestjs/mongoose';
import { CommentRepository } from '../../application/repositories/comment.repository';
import { MongoComment, Optional } from '@app/core';
import { Model } from 'mongoose';
import { Comment } from '../../application/models/comment.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoCommentRepository implements CommentRepository {
  constructor(
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
  ) {}

  async findCommentById(commentId: string): Promise<Optional<Comment>> {
    const comment = await this.commentModel.findOne({ id: commentId });

    return comment
      ? Optional.of({
          id: comment.id,
          content: comment.content,
          blog: comment.blog,
          publisher: {
            id: comment.publisher.id,
            name: comment.publisher.name,
            image: comment.publisher.image,
          },
          publishDate: comment.publishDate,
          likes: comment.likes,
          dislikes: comment.dislikes,
          numberOfLikes: comment.numberOfLikes,
          numberOfDislikes: comment.numberOfDislikes,
        })
      : Optional.empty();
  }
}
