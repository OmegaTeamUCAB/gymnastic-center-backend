import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UUIDModule } from '@app/core/infrastructure/uuid/uuid.module';
import { CategoryController } from './controllers/category.controller';
import { CategorySchema, MongoCategory } from './models/mongo-category.model';
import { MongoCategoryRepository } from './repositories/mongo-category.repository';
import { CATEGORY_REPOSITORY } from './constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoCategory.name,
        schema: CategorySchema,
      },
    ]),
    UUIDModule
  ],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: MongoCategoryRepository,
    },
  ],
})
export class CategoryModule {}
