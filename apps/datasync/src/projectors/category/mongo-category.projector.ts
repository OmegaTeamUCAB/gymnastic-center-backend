import { MongoCategory } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType, Projector } from '../../types';

@Injectable()
export class MongoCategoryProjector implements Projector {
  constructor(
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
  ) {}

  async clear(): Promise<void> {
    await this.categoryModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onCategoryCreated(
    event: EventType<{
      name: string;
      icon: string;
    }>,
  ) {
    const { name, icon } = event.context;
    await this.categoryModel.create({ id: event.dispatcherId, name, icon });
  }

  async onCategoryNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.categoryModel.updateOne({ id: event.dispatcherId }, { name });
  }

  async onCategoryIconUpdated(
    event: EventType<{
      icon: string;
    }>,
  ) {
    const { icon } = event.context;
    await this.categoryModel.updateOne({ id: event.dispatcherId }, { icon });
  }
}
