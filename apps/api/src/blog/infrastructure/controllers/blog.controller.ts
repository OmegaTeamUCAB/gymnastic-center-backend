import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAllBlogsQuery,
  GetBlogByIdQuery,
  CreateBlogCommentCommand,
  CreateBlogCommand,
} from '../../application';
import { CreateBlogCommentDto, CreateBlogDto } from './dtos';
import { IdGenerator, IdResponse, UUIDGENERATOR } from '@app/core';
import { BlogResponse } from './responses';
import { BlogRepository } from '../../domain';
import { BLOG_REPOSITORY } from '../constants';

@Controller('blog')
@ApiTags('Blogs')
export class BlogController {
  constructor(
    @Inject(BLOG_REPOSITORY)
    private readonly repository: BlogRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Blogs list',
    type: [BlogResponse],
  })
  @Get()
  async getAllBlogs() {
    const service = new GetAllBlogsQuery(this.repository);
    const result = await service.execute();
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'Blog details',
    type: BlogResponse,
  })
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const service = new GetBlogByIdQuery(this.repository);
    const result = await service.execute({ id });
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: IdResponse,
  })
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const service = new CreateBlogCommand(this.repository, this.uuidGenerator);
    const result = await service.execute(createBlogDto);
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully posted',
    type: IdResponse,
  })
  @Post('/create-comment')
  async createComment(@Body() crateBlogCommentDto: CreateBlogCommentDto) {
    const service = new CreateBlogCommentCommand(
      this.repository,
      this.uuidGenerator,
    );
    const result = await service.execute(crateBlogCommentDto);
    return result.unwrap();
  }
}
