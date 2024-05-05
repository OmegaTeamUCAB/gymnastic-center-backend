import { ApplicationService, Result } from '@app/core';
import { Blog, BlogRepository } from '../../../domain';
import { CreateBlogResponse, CreateBlogDto } from './types';
import { IdGenerator } from '@app/core';

export class CreateBlogCommand implements ApplicationService<CreateBlogDto, CreateBlogResponse> {
    constructor(
        private readonly blogRepository: BlogRepository,
        private readonly idGenerator: IdGenerator<string>,
    ) { }

    async execute(data: CreateBlogDto) {
        const id = this.idGenerator.generateId();
        const blog = new Blog(id, data.imageUrl, data.title, data.description, data.content, data.uploadDate, []);
        await this.blogRepository.createBlog(blog);

        return Result.success<CreateBlogResponse>({ id });
    }
}