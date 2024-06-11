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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAllBlogsQuery,
  GetBlogByIdQuery,
  CreateBlogCommand,
  UpdateBlogCommand,
} from '../../application';
import { CreateBlogCommentDto, CreateBlogDto, UpdateBlogDto } from './dtos';
import { IdGenerator, IdResponse, UUIDGENERATOR } from '@app/core';
import { BlogLeanResponse, BlogResponse } from './responses';
import { BlogRepository } from '../../domain';
import { BLOG_REPOSITORY } from '../constants';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';

@Controller('blog')
@ApiTags('Blogs')
@Auth()
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
    type: [BlogLeanResponse],
  })
  @Get('many')
  async getAllBlogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) limit: number,
    @Query('filter') filter?: 'POPULAR' | 'RECENT',
    @Query('trainer') trainer?: string,
    @Query('category') category?: string,
  ) {
    const service = new GetAllBlogsQuery(this.repository);
    const result = await service.execute();
    return result.unwrap();
  }

  @ApiResponse({
    status: 200,
    description: 'Blog details',
    type: BlogResponse,
  })
  @Get('one/:id')
  async getBlogById(@Param('id', ParseUUIDPipe) id: string) {
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
