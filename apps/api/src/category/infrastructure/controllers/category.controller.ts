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
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
} from '../../application/commands';
import { CategoryResponse } from './responses';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import {
  CategoryDocument,
  MongoCategory,
} from '../models/mongo-category.model';
import { CategoryNotFoundException } from '../../application/exceptions';

@Controller('category')
@ApiTags('Categories')
@Auth()
export class CategoryController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  @Get('many')
  @ApiResponse({
    status: 200,
    description: 'Categories list',
    type: [CategoryResponse],
  })
  async getCategories(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryModel
      .find()
      .skip(page * perPage)
      .limit(perPage);
    return categories.map((category) => ({
      id: category.aggregateId,
      name: category.name,
      icon: category.icon,
    }));
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: CategoryResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async getCategoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponse> {
    const category = await this.categoryModel.findOne({
      aggregateId: id,
    });
    if (!category) throw new CategoryNotFoundException();
    return {
      id: category.aggregateId,
      name: category.name,
      icon: category.icon,
    };
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Category created',
    type: IdResponse,
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const service = new CreateCategoryCommandHandler(
      this.uuidGenerator,
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute(createCategoryDto);
    return result.unwrap();
  }

  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Category updated',
    type: IdResponse,
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const service = new UpdateCategoryCommandHandler(
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute({ id, ...updateCategoryDto });
    return result.unwrap();
  }
}
