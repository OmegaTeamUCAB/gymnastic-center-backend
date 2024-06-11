import { ApplicationService, Result } from '@app/core';
import { UpdateBlogResponse, UpdateBlogDto } from './types';
import { BlogRepository } from '../../../domain';
import { BlogNotFoundException } from '../../exceptions';

export class UpdateBlogCommand
  implements ApplicationService<UpdateBlogDto, UpdateBlogResponse>
{
  constructor(private readonly repository: BlogRepository) {}

  async execute(data: UpdateBlogDto): Promise<Result<UpdateBlogResponse>> {
    const blog = await this.repository.getBlogById(data.id);
    if (!blog)
      return Result.failure<UpdateBlogResponse>(new BlogNotFoundException());
    blog.imageUrl = data.imageUrl ?? blog.imageUrl;
    blog.title = data.title ?? blog.title;
    blog.description = data.description ?? blog.description;
    blog.content = data.content ?? blog.content;
    blog.tags = data.tags ?? blog.tags;
    blog.categoryId = data.categoryId ?? blog.categoryId;
    await this.repository.saveBlog(blog);
    return Result.success<UpdateBlogResponse>({ id: blog.id });
  }
}
