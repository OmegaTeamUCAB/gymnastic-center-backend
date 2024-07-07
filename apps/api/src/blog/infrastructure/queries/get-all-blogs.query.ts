import { MongoBlog } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogLeanResponse } from '../controllers/responses';

type Dto = {
  category: string;
  trainer: string;
  filter: string;
  page: number;
  perPage: number;
};

export class GetAllBlogsQuery {
  constructor(
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
  ) {}

  async execute(dto: Dto): Promise<BlogLeanResponse[]> {
    const { category, trainer, filter, page, perPage } = dto;
    const blogs = await this.blogModel.find(
      {
        ...(trainer && { 'trainer.id': trainer }),
        ...(category && { 'category.id': category }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        perPage,
        sort: filter === 'POPULAR' ? { comments: -1 } : { uploadDate: -1 },
      },
    );
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      image: blog.images[0],
      trainer: blog.trainer.name,
      category: blog.category.name,
      date: blog.uploadDate,
    }));
  }
}
