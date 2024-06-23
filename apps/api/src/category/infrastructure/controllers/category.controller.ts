import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import {
  IdResponse,
  UUIDGENERATOR,
  IdGenerator,
  EVENT_STORE,
  EventStore,
  LOCAL_EVENT_HANDLER,
  EventHandler,
  MongoCategory,
  ILogger,
  LOGGER,
  LoggingDecorator,
} from '@app/core';
import {
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
} from '../../application/commands';
import { CategoryResponse } from './responses';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
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
    private readonly categoryModel: Model<MongoCategory>,
    @Inject(LOGGER)
    private readonly logger: ILogger,
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
  @ApiResponse({
    status: 200,
    description: 'Categories list',
    type: [CategoryResponse],
  })
  async getCategories(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryModel.find({}, null, {
      skip: (page - 1) * perPage,
      limit: perPage,
    });
    return categories.map((category) => ({
      id: category.id,
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
      id,
    });
    if (!category) throw new NotFoundException(new CategoryNotFoundException());
    return {
      id: category.id,
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
    const service = new LoggingDecorator(
      new CreateCategoryCommandHandler(
        this.uuidGenerator,
        this.eventStore,
        this.localEventHandler,
      ),
      this.logger,
      'Create Category',
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
    const service = new LoggingDecorator(
      new UpdateCategoryCommandHandler(this.eventStore, this.localEventHandler),
      this.logger,
      'Update Category',
    );
    const result = await service.execute({ id, ...updateCategoryDto });
    return result.unwrap();
  }
}
