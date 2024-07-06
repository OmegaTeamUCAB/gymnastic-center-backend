import { MongoBlog, MongoCourse } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogResponse } from '../controllers/responses';
import { NotFoundException } from '@nestjs/common';
import { BlogNotFoundException } from '../../application/exceptions';

type Dto = {
  id: string;
};

export class GetBlogByIdQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly blogModel: Model<MongoBlog>,
  ) {}

  async execute(dto: Dto): Promise<BlogResponse> {
    const { id } = dto;
    const blog = await this.blogModel.findOne({ id });
    if (!blog) throw new NotFoundException(new BlogNotFoundException());
    return {
      id: blog.id,
      title: blog.title,
      description: blog.content,
      images: blog.images,
      trainer: {
        id: blog.trainer.id,
        name: blog.trainer.name,
        image: blog.trainer.image,
      },
      category: blog.category.name,
      date: blog.uploadDate,
      tags: blog.tags,
      comments: blog.comments,
    };
  }
}
