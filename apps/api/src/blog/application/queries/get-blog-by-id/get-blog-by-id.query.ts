import { ApplicationException, ApplicationService, Result } from "@app/core";
import { GetBlogByIdDto } from "./types/get-blog-by-id.dto";
import { GetBlogByIdResponse } from "./types/get-blog-by-id-response";
import { BlogRepository } from "../../../domain/repositories/blog.repository";
import { BlogNotFound } from "../../exceptions/blog-not-found";

export class GetBlogByIdQuery implements ApplicationService<GetBlogByIdDto, GetBlogByIdResponse> {
    constructor(private readonly repository: BlogRepository) {}
    
    async execute(data: GetBlogByIdDto): Promise<Result<GetBlogByIdResponse>> {
        const blog = await this.repository.getBlogById(data.id);

        if(!blog) return Result.failure<GetBlogByIdResponse>(new BlogNotFound());

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