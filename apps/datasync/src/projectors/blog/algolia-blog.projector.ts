import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchClient, SearchIndex } from 'algoliasearch';
import { Model } from 'mongoose';
import {
  InjectAlgolia,
  MongoBlog,
  MongoCategory,
  MongoInstructor,
} from '@app/core';
import { EventType, Projector } from '../../types';

@Injectable()
export class AlgoliaBlogProjector implements Projector, OnModuleInit {
  constructor(
    @InjectAlgolia()
    private readonly algolia: SearchClient,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
  ) {
    this.index = this.algolia.initIndex('blogs');
  }

  private index: SearchIndex;

  async onModuleInit() {
    await this.index.setSettings({
      searchableAttributes: [
        'title',
        'instructor',
        'category',
        'content',
        'tags',
      ],
      attributesForFaceting: ['searchable(tags)'],
    });
  }

  async project(event: EventType) {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async clear() {
    await this.index.clearObjects();
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
    if (!category || !instructor) return;
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
    if (!category) return;
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

  async onCategoryNameUpdated(
    data: EventType<{
      name: string;
    }>,
  ) {
    const { name } = data.context;
    const blogs = await this.blogModel.find({
      'category.id': data.dispatcherId,
    });
    await Promise.all(
      blogs.map((blog) =>
        this.index.partialUpdateObject({
          objectID: blog.id,
          category: name,
        }),
      ),
    );
  }
}
