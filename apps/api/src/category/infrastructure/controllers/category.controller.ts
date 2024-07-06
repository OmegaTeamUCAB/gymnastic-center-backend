import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IdResponse,
  UUIDGENERATOR,
  IdGenerator,
  EVENT_STORE,
  EventStore,
  ILogger,
  LOGGER,
  LoggingDecorator,
  PerformanceMonitorDecorator,
  NativeTimer,
  ExceptionParserDecorator,
  baseExceptionParser,
} from '@app/core';
import {
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
} from '../../application/commands';
import { CategoryResponse } from './responses';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { GetAllCategoriesQuery, GetCategoryByIdQuery } from '../queries';

@Controller('category')
@ApiTags('Categories')
@Auth()
export class CategoryController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly getAllCategoriesQuery: GetAllCategoriesQuery,
    private readonly getCategoryByIdQuery: GetCategoryByIdQuery,
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
  getCategories(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
  ): Promise<CategoryResponse[]> {
    return this.getAllCategoriesQuery.execute({ page, perPage });
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
    return this.getCategoryByIdQuery.execute({ id });
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Category created',
    type: IdResponse,
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const operationName = 'Create Category';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new CreateCategoryCommandHandler(this.uuidGenerator, this.eventStore),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      baseExceptionParser,
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
    const operationName = 'Update Category';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new UpdateCategoryCommandHandler(this.eventStore),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      baseExceptionParser,
    );
    const result = await service.execute({ id, ...updateCategoryDto });
    return result.unwrap();
  }
}
