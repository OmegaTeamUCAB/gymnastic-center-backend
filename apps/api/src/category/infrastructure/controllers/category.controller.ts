import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdResponse } from '@app/core';
import { CATEGORY_REPOSITORY } from '../constants';
import { CategoryRepository } from '../../domain';
import {
  GetCategoriesQuery,
  GetCategoryByIdQuery,
} from '../../application/queries';
import { CreateCategoryDto } from './dtos';
import { UUIDService } from '@app/core/infrastructure/uuid/providers/uuid.service';
import { UUIDGENERATOR } from '@app/core/infrastructure/uuid/constants';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from '../../application/commands';
import { CategoryResponse } from './responses';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: UUIDService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Categories list',
    type: [CategoryResponse],
  })
  async getCategories() {
    const service = new GetCategoriesQuery(this.categoryRepository);
    const result = await service.execute();
    return result.unwrap();
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
  async getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    const service = new GetCategoryByIdQuery(this.categoryRepository);
    const result = await service.execute({ id });
    return result.unwrap();
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Category created',
    type: IdResponse,
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const service = new CreateCategoryCommand(this.categoryRepository, {
      generateId: () => {
        return this.uuidGenerator.generateUUID();
      },
    });
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
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const service = new UpdateCategoryCommand(this.categoryRepository);
    const result = await service.execute({ id, ...createCategoryDto });
    return result.unwrap();
  }
}
