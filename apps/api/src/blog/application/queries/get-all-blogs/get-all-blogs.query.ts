import { BlogRepository } from '../../../domain';
import { GetAllBlogsReponse } from './types';
import { ApplicationService, Result } from '@app/core';

export class GetAllBlogsQuery implements ApplicationService<void, GetAllBlogsReponse> {
    constructor(private readonly datasource: BlogRepository) { }

    async execute(): Promise<Result<GetAllBlogsReponse>> {
        const blogs = await this.datasource.findAllBlogs();

        if (blogs.length === 0)
            return Result.success<GetAllBlogsReponse>([]);

        return Result.success<GetAllBlogsReponse>(blogs.map(({ id, imageUrl, comments, title, description, content, tags, uploadDate }) =>
        ({
            id,
            imageUrl,
            comments: comments.map(({ id, userId, blogId, content, postedAt }) => ({
                id,
                userId,
                blogId,
                content,
                postedAt,
            })),
            title,
            description,
            content,
            tags,
            uploadDate,
        }))
        );
    }
}   