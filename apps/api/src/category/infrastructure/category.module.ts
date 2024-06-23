import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UUIDModule } from '@app/core/infrastructure/uuid/uuid.module';
import { CategoryController } from './controllers/category.controller';
import { AuthModule } from '../../auth/infrastructure';
import {
  EventHandlerModule,
  EventStoreModule,
  CategorySchema,
  MongoCategory,
  LoggerModule,
} from '@app/core';

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
    EventHandlerModule,
    LoggerModule,
  ],
  controllers: [CategoryController],
  providers: [],
})
export class CategoryModule {}
