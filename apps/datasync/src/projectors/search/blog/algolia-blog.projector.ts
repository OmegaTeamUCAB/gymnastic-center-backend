import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchClient, SearchIndex } from 'algoliasearch';
import { Model } from 'mongoose';
import {
  InjectAlgolia,
  MongoCategory,
  MongoEventProvider,
  MongoInstructor,
} from '@app/core';
import { EventType } from '../../../types';

@Injectable()
export class AlgoliaBlogProjector implements OnApplicationBootstrap {
  constructor(
    @InjectAlgolia()
    private readonly algolia: SearchClient,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    private readonly eventProvider: MongoEventProvider,
  ) {
    this.index = this.algolia.initIndex('blog');
  }

  private index: SearchIndex;

  async onApplicationBootstrap() {
    this.index.setSettings({
      searchableAttributes: [
        'title',
        'instructor',
        'category',
        'content',
        'tags',
      ],
      attributesForFaceting: ['tags'],
    });
    await this.index.clearObjects();
    const events = await this.eventProvider.getEvents();
    for (const event of events) await this.handleEvent(event);
  }

  async handleEvent(event: EventType) {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onBlogCreated(
    event: EventType<{
      title: string;
      content: string;
      creationDate: Date;
      images: string[];
      tags: string[];
      category: string;
      instructor: string;
    }>,
  ) {
    const [category, instructor] = await Promise.all([
      this.categoryModel.findOne({ id: event.context.category }),
      this.instructorModel.findOne({ id: event.context.instructor }),
    ]);
    if (!category || !instructor) {
      //this.rmqService.nack(context);
      return;
    }
    const { title, content, tags } = event.context;
    await this.index.saveObject({
      objectID: event.dispatcherId,
      id: event.dispatcherId,
      title,
      content,
      tags,
      category: category.name,
      instructor: instructor.name,
      image: event.context.images[0],
    });
  }

  async onBlogTitleUpdated(
    event: EventType<{
      title: string;
    }>,
  ) {
    const { title } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      title,
    });
  }

  async onBlogContentUpdated(
    event: EventType<{
      content: string;
    }>,
  ) {
    const { content } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      content,
    });
  }

  async onBlogTagsUpdated(
    event: EventType<{
      tags: string[];
    }>,
  ) {
    const { tags } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      tags,
    });
  }

  async onBlogCategoryUpdated(
    event: EventType<{
      category: string;
    }>,
  ) {
    const category = await this.categoryModel.findOne({
      id: event.context.category,
    });
    if (!category) {
      //this.rmqService.nack(context);
      return;
    }
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      category: category.name,
    });
  }

  async onBlogImagesUpdated(
    event: EventType<{
      images: string[];
    }>,
  ) {
    const { images } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      image: images[0],
    });
  }
}
