import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateBlogCommand } from '../../application/commands/create-blog/create-blog.command';
import { MongoBlogRepository } from '../repositories/mongo-blog-repository';
import { InjectModel } from '@nestjs/mongoose';
import { MongoBlog } from '../models/blog.model';
import { Model } from 'mongoose';
import { Blog } from '../../domain/blog';
import { IdGenerator, UUIDGENERATOR } from '@app/core';
import { ApiResponse } from '@nestjs/swagger';
import { BlogResponse } from '../response/blog.response';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { GetAllBlogsQuery } from '../../application/queries/get-all-blogs/get-all-blogs.query';
import { GetBlogByIdQuery } from '../../application/queries/get-blog-by-id/get-blog-by-id.query';
import { GetBlogByIdDto } from '../../application/queries/get-blog-by-id/types/get-blog-by-id.dto';

@Controller('blog')
export class BlogController {
  constructor(
    @InjectModel(MongoBlog.name) private readonly blogModel: Model<Blog>,

    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) { }

  @ApiResponse({
    status: 200,
    description: 'Blogs list',
    type: [BlogResponse],
  })

  @Get()
  getAllBlogs() {
    const repository = new MongoBlogRepository(this.blogModel);
    const service = new GetAllBlogsQuery(repository);

    return service.execute()
  }

  @ApiResponse({
    
  })
  @Get(':id')
  getBlogById(@Param('id') id: string) {
    const data: GetBlogByIdDto = { id };
    const repository = new MongoBlogRepository(this.blogModel);
    const service = new GetBlogByIdQuery(repository);

    return service.execute(data);
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: [BlogResponse],
  })

  @Post()
  createBlog(@Body() createBlogDto: CreateBlogDto) {

    const repository = new MongoBlogRepository(this.blogModel);

    const service = new CreateBlogCommand(repository, this.uuidGenerator);

    service.execute(createBlogDto);
  }

}
