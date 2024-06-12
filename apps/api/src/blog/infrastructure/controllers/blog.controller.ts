import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import {
  IdResponse,
  UUIDGENERATOR,
  IdGenerator,
  EVENT_STORE,
  EventStore,
  LOCAL_EVENT_HANDLER,
  EventHandler,
} from '@app/core';
import {
  CreateBlogCommandHandler,
  UpdateBlogCommandHandler,
} from '../../application/commands';
import { BlogResponse } from './responses';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import {
  BlogDocument,
  MongoBlog,
} from '../models/mongo-Blog.model';
import { BlogNotFoundException } from '../../application/exceptions';

@Controller('Blog')
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
    private readonly BlogModel: Model<BlogDocument>,
  ) {}

  @Get('many')
  @ApiResponse({
    status: 200,
    description: 'Blogs list',
    type: [BlogResponse],
  })
  async getBlogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ): Promise<BlogResponse[]> {
    const blogs = await this.BlogModel
      .find()
      .skip(page * perPage)
      .limit(perPage);
    return blogs.map((Blog) => ({
      id: Blog.aggregateId,
      name: Blog.name,
      icon: Blog.icon,
    }));
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Blog found',
    type: BlogResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  async getBlogById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BlogResponse> {
    const blog = await this.BlogModel.findOne({
      aggregateId: id,
    });
    if (!blog) throw new BlogNotFoundException();
    return {
      id: blog.aggregateId,
      name: blog.name,
      icon: blog.icon,
    };
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Blog created',
    type: IdResponse,
  })
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const service = new CreateBlogCommandHandler(
      this.uuidGenerator,
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute(createBlogDto);
    return result.unwrap();
  }

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
