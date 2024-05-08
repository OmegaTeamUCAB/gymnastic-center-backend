import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogRepository } from '../../domain/blog/repositories/blog.repository';
import { BlogComment } from '../../domain/comment/blog-comment';
import { Blog } from '../../domain/blog/blog';
import { MongoBlog, MongoBlogDocument } from '../models/blog.model';

@Injectable()
export class MongoBlogRepository implements BlogRepository {
  constructor(
    @InjectModel(MongoBlog.name)
    private readonly datasource: Model<MongoBlogDocument>,
  ) {}

  async findAllBlogs(): Promise<Blog[]> {
    const blogs = await this.datasource.find();
    if (!blogs) return [];
    return blogs.map(
      ({
        aggregateId,
        imageUrl,
        comments,
        title,
        description,
        content,
        tags,
        uploadDate,
        instructorId,
        categoryId,
      }) =>
        new Blog(
          aggregateId,
          imageUrl,
          title,
          description,
          content,
          categoryId,
          instructorId,
          uploadDate,
          comments.map(
            ({ id, userId, blogId, content, postedAt }) =>
              new BlogComment(id, userId, blogId, content, postedAt),
          ),
          tags,
        ),
    );
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.datasource.findOne({ aggregateId: id });
    if (!blog) return null;
    return new Blog(
      blog.aggregateId,
      blog.imageUrl,
      blog.title,
      blog.description,
      blog.content,
      blog.categoryId,
      blog.instructorId,
      blog.uploadDate,
      blog.comments.map(
        ({ id, userId, blogId, content, postedAt }) =>
          new BlogComment(id, userId, blogId, content, postedAt),
      ),
      blog.tags,
    );
  }

  async saveBlog(data: Blog): Promise<void> {
    await this.datasource.updateOne(
      {
        aggregateId: data.id,
      },
      {
        $set: {
          imageUrl: data.imageUrl,
          title: data.title,
          description: data.description,
          content: data.content,
          uploadDate: data.uploadDate,
          comments: data.comments,
          tags: data.tags,
          categoryId: data.categoryId,
          instructorId: data.instructorId,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async createComment(data: BlogComment): Promise<void> {
    await this.datasource.updateOne(
      {
        aggregateId: data.blogId,
      },
      {
        $push: {
          comments: {
            id: data.id,
            userId: data.userId,
            blogId: data.blogId,
            content: data.content,
            postedAt: data.postedAt,
          },
        },
      },
    );
  }
}
