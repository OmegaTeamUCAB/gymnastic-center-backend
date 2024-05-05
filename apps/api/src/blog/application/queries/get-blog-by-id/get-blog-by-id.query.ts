import { BlogRepository } from '../../../domain';
import { GetBlogByIdDto, GetBlogByIdResponse } from './types';
import { BlogNotFound } from '../../exceptions';
import { ApplicationService, Result } from '@app/core';

export class GetBlogByIdQuery implements ApplicationService<GetBlogByIdDto, GetBlogByIdResponse> {
    constructor(private readonly repository: BlogRepository) { }

    async execute(data: GetBlogByIdDto): Promise<Result<GetBlogByIdResponse>> {
        const blog = await this.repository.getBlogById(data.id);

        if (!blog) return Result.failure<GetBlogByIdResponse>(new BlogNotFound());

        return Result.success<GetBlogByIdResponse>({
            id: blog.id,
            imageUrl: blog.imageUrl,
            title: blog.title,
            description: blog.description,
            content: blog.content,
            uploadDate: blog.uploadDate,
        });
    }
}