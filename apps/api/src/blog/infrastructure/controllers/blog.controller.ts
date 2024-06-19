import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
  ParseUUIDPipe,
  Query,
  Post,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BlogNotFoundException,
  CreateBlogCommandHandler,
  UpdateBlogCommandHandler,
} from '../../application';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import {
  EVENT_STORE,
  EventHandler,
  EventStore,
  IdGenerator,
  IdResponse,
  LOCAL_EVENT_HANDLER,
  MongoBlog,
  UUIDGENERATOR,
} from '@app/core';
import { BlogLeanResponse, BlogResponse } from './responses';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('blog')
@ApiTags('Blogs')
@Auth()
export class BlogController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
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
    type: [BlogResponse],
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
      images: blog.images,
      trainer: blog.trainer.name,
      category: blog.category.name,
      date: blog.uploadDate,
    }));
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'Blog found',
    type: BlogResponse,
  })
  @Get('one/:id')
  async getBlogById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BlogResponse> {
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
      },
      category: blog.category.name,
      date: blog.uploadDate,
      tags: blog.tags,
      comments: blog.comments,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: IdResponse,
  })
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const service = new CreateBlogCommandHandler(
      this.uuidGenerator,
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({
      ...createBlogDto,
    });
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: IdResponse,
  })
  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Blog updated',
    type: IdResponse,
  })
  async updateBlog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const service = new UpdateBlogCommandHandler(
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({ id, ...updateBlogDto });
    return result.unwrap();
  }
}
