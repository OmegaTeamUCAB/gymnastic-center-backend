import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BlogNotFoundException,
  CreateBlogCommand,
  UpdateBlogCommand,
} from '../../application';
import { CreateBlogCommentDto, CreateBlogDto, UpdateBlogDto } from './dtos';
import { IdGenerator, IdResponse, UUIDGENERATOR } from '@app/core';
import { BlogLeanResponse, BlogResponse } from './responses';
import { BlogRepository } from '../../domain';
import { BLOG_REPOSITORY } from '../constants';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { MongoBlog } from '../models';
import { Model } from 'mongoose';

@Controller('blog')
@ApiTags('Blogs')
@Auth()
export class BlogController {
  constructor(
    @Inject(BLOG_REPOSITORY)
    private readonly repository: BlogRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
  ) {}

  @Get('many')
  @ApiQuery({
    name: 'perPage',
    required: false,
    description:
      'Number of results to return for each type of search. DEFAULT = 8',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number of . DEFAULT = 1',
    type: Number,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Blog Sorting',
    type: String,
    enum: ['POPULAR', 'RECENT'],
  })
  @ApiQuery({
    name: 'trainer',
    required: false,
    description: 'Instructor id filter',
    type: String,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category id filter',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Blogs list',
    type: [BlogLeanResponse],
  })
  async getAllBlogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('filter') filter?: 'POPULAR' | 'RECENT',
    @Query('trainer') trainer?: string,
    @Query('category') category?: string,
  ): Promise<BlogLeanResponse[]> {
    const blogs = await this.blogModel.find(
      {
        ...(trainer && { instructorId: trainer }),
        ...(category && { categoryId: category }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        perPage,
      },
    );
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      image: blog.imageUrl,
      trainer: blog.instructorId,
      category: blog.categoryId,
      date: blog.createdAt,
    }));
  }

  @ApiResponse({
    status: 200,
    description: 'Blog details',
    type: BlogResponse,
  })
  @Get('one/:id')
  async getBlogById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BlogResponse> {
    const blog = await this.blogModel.findOne({ aggregateId: id });
    if (!blog) throw new NotFoundException(new BlogNotFoundException());
    return {
      id: blog.id,
      title: blog.title,
      description: blog.content,
      images: [blog.imageUrl],
      trainer: {
        id: blog.instructorId,
        name: 'El Tigre',
      },
      category: blog.categoryId,
      date: blog.createdAt,
      tags: blog.tags,
    };
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
    const response = result.unwrap();
    return response;
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: IdResponse,
  })
  @Post(':id')
  async updateBlog(
    @Body() updateBlogDto: UpdateBlogDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service = new UpdateBlogCommand(this.repository);
    const result = await service.execute({ ...updateBlogDto, id });
    const response = result.unwrap();
    return response;
  }
}
