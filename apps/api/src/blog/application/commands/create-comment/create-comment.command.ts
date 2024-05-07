import { BlogRepository, BlogComment } from '../../../domain';
import { CreateBlogCommentDto, CreateBlogCommentResponse } from './types';
import { ApplicationService, IdGenerator, Result } from '@app/core';

export class CreateBlogCommentCommand
  implements
    ApplicationService<CreateBlogCommentDto, CreateBlogCommentResponse>
{
  constructor(
    private readonly repository: BlogRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(
    data: CreateBlogCommentDto,
  ): Promise<Result<CreateBlogCommentResponse>> {
    const id = this.idGenerator.generateId();
    const blogComment = new BlogComment(
      id,
      data.userId,
      data.blogId,
      data.content,
      data.postedAt,
    );
    await this.repository.createComment(blogComment);
    return Result.success<CreateBlogCommentResponse>({ id });
  }
}
