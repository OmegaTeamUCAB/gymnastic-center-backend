import { BlogRepository } from '../../domain/blog/repositories/blog.repository';
import { BlogComment } from '../../domain/comment/blog-comment';
import { Blog } from '../../domain/blog/blog';
import { MongoBlog } from '../models/blog.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class MongoBlogRepository implements BlogRepository {
    constructor(@InjectModel(MongoBlog.name) private readonly datasource: Model<Blog>) { }

    async findAllBlogs(): Promise<Blog[]> {
        const blogs = await this.datasource.find();
        if (!blogs) return [];

        return blogs;
    }

    async getBlogById(id: string): Promise<Blog> {
        const blog = await this.datasource.findOne({ aggregateId: id });
        if (!blog) return null;

        return blog;
    }

    async createBlog(data: Blog): Promise<void> {
        await this.datasource.updateOne(
            {
                aggregateId: data.id
            },
            {
                $set: {
                    imageUrl: data.imageUrl,
                    title: data.title,
                    description: data.description,
                    content: data.content,
                    uploadDate: data.uploadDate,
                    comments: data.comments,
                    tags: data.tags
                }
            },
            {
                upsert: true
            }
        )

        return;
    }

    async createComment(data: BlogComment): Promise<void> {
        await this.datasource.updateOne(
            {
                aggregateId: data.blogId
            },
            {
                $push: {
                    comments: {
                        id: data.id,
                        userId: data.userId,
                        blogId: data.blogId,
                        content: data.content,
                        postedAt: data.postedAt,
                    }
                }
            }
        )
        return;
    }
}