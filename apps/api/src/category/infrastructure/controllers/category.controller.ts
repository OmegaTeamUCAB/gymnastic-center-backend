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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdResponse, UUIDGENERATOR, IdGenerator } from '@app/core';
import { CATEGORY_REPOSITORY } from '../constants';
import { CategoryRepository } from '../../domain';
import {
  GetCategoriesQuery,
  GetCategoryByIdQuery,
} from '../../application/queries';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from '../../application/commands';
import { CategoryResponse } from './responses';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';

@Controller('category')
@ApiTags('Categories')
@Auth()
export class CategoryController {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
  ) {}

  @Get('many')
  @ApiResponse({
    status: 200,
    description: 'Categories list',
    type: [CategoryResponse],
  })
  async getCategories(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) limit: number,
  ) {
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
    const service = new CreateCategoryCommand(
      this.categoryRepository,
      this.uuidGenerator,
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
    const service = new UpdateCategoryCommand(this.categoryRepository);
    const result = await service.execute({ id, ...updateCategoryDto });
    return result.unwrap();
  }
}
