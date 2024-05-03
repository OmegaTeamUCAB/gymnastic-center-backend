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

@Controller('blog')
export class BlogController {
  constructor( 
    @InjectModel(MongoBlog.name) private readonly blogModel: Model<Blog>,

    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully created',
    type: [BlogResponse],
})
  
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {

    const repository = new MongoBlogRepository(this.blogModel);
    
    const createBlogCommand = new CreateBlogCommand( repository, this.uuidGenerator );

    createBlogCommand.execute(createBlogDto);
  }

}