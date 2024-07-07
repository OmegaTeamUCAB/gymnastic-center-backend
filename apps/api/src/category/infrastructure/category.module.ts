import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UUIDModule } from '@app/core/infrastructure/uuid/uuid.module';
import { CategoryController } from './controllers/category.controller';
import { AuthModule } from '../../auth/infrastructure';
import {
  EventStoreModule,
  CategorySchema,
  MongoCategory,
  LoggerModule,
} from '@app/core';
import { GetAllCategoriesQuery, GetCategoryByIdQuery } from './queries';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoCategory.name,
        schema: CategorySchema,
      },
    ]),
    AuthModule,
    UUIDModule,
    EventStoreModule,
    LoggerModule,
  ],
  controllers: [CategoryController],
  providers: [
    GetAllCategoriesQuery,
    GetCategoryByIdQuery,
  ],
})
export class CategoryModule {}
