import { Blog } from '../../../domain';
import { GetAllBlogsQuery, GetBlogByIdQuery, GetBlogByIdDto, CreateBlogCommentCommand, CreateBlogCommand } from '../../../application';
import { BlogResponse, MongoBlog, MongoBlogRepository, CreateBlogCommentDto, CreateBlogDto, BLogCommentResponse  } from "../../index";
import { IdGenerator, UUIDGENERATOR } from '@app/core';
import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';

@Controller('blog')
@ApiTags('Blogs')
export class BlogController {
  constructor(
    @InjectModel(MongoBlog.name) private readonly blogModel: Model<Blog>,

    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) { }

  @ApiResponse({
    status: 200,
    description: 'Blogs list',
    type: BlogResponse,
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
  })

  @Post()
  createBlog(@Body() createBlogDto: CreateBlogDto) {

    const repository = new MongoBlogRepository(this.blogModel);

    const service = new CreateBlogCommand(repository, this.uuidGenerator);

    service.execute(createBlogDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully posted',
  })
  @Post('/create-comment')
  createComment(@Body() crateBlogCommentDto: CreateBlogCommentDto) {
    const repository = new MongoBlogRepository(this.blogModel);

    const service = new CreateBlogCommentCommand(repository, this.uuidGenerator);

    service.execute(crateBlogCommentDto);
  }

}
