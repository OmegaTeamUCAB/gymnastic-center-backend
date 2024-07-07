import { InjectModel } from '@nestjs/mongoose';
import { CommentRepository } from '../../application/repositories/comment.repository';
import { MongoComment, Optional } from '@app/core';
import { Model } from 'mongoose';
import { Comment } from '../../application/models/comment.model';

export class MongoCommentRepository implements CommentRepository {
  constructor(
    @InjectModel(MongoComment.name)
    private readonly commentModel: Model<MongoComment>,
  ) {}

  async findCommentById(commentId: string): Promise<Optional<Comment>> {
    const comment = await this.commentModel.findOne({ id: commentId });
    if (!comment) return Optional.empty();

    return Optional.of(
      new Comment(
        comment.id,
        comment.content,
        comment.blog,
        comment.publisher,
        comment.publishDate,
        comment.likes,
        comment.dislikes,
        comment.numberOfLikes,
        comment.numberOfDislikes,
      ),
    );
  }
}
