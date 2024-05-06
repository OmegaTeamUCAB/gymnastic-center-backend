import { BlogRepository, BlogComment } from '../../../domain';
import { CreateBlogCommentDto, createBlogCommentResponse } from './types';
import { ApplicationService, IdGenerator, Result } from '@app/core';

export class CreateBlogCommentCommand implements ApplicationService<CreateBlogCommentDto, createBlogCommentResponse> {
    constructor(
        private readonly repository: BlogRepository,
        private readonly idGenerator: IdGenerator<string>,
    ) { }

    async execute(data: CreateBlogCommentDto): Promise<Result<createBlogCommentResponse>> {
        const id = this.idGenerator.generateId();
        const blogComment = new BlogComment(id, data.userId, data.blogId, data.content, data.postedAt);

        await this.repository.createComment(blogComment);

        return Result.success<createBlogCommentResponse>({ id });
    }
}