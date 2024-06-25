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
export class AlgoliaCourseProjector implements OnApplicationBootstrap {
  constructor(
    @InjectAlgolia()
    private readonly algolia: SearchClient,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    private readonly eventProvider: MongoEventProvider,
  ) {
    this.index = this.algolia.initIndex('course');
  }

  private index: SearchIndex;

  async onApplicationBootstrap() {
    this.index.setSettings({
      searchableAttributes: [
        'name',
        'instructor',
        'category',
        'lessonTitles',
        'description',
        'tags',
        'lessonDescriptions',
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

  async onCourseCreated(
    event: EventType<{
      name: string;
      description: string;
      level: number;
      tags: string[];
      weeks: number;
      minutes: number;
      image: string;
      category: string;
      instructor: string;
      publishDate: Date;
      lessons: {
        id: string;
        title: string;
        description: string;
        video: string;
      }[];
    }>,
  ) {
    const { name, description, tags, lessons, image } = event.context;
    const [category, instructor] = await Promise.all([
      this.categoryModel.findOne({ id: event.context.category }),
      this.instructorModel.findOne({ id: event.context.instructor }),
    ]);
    if (!category || !instructor) {
      //this.rmqService.nack(context);
      return;
    }
    await this.index.saveObject({
      objectID: event.dispatcherId,
      id: event.dispatcherId,
      name,
      description,
      tags,
      image,
      category: category.name,
      instructor: instructor.name,
      lessonTitles: lessons.map((lesson) => lesson.title),
      lessonDescriptions: lessons.map((lesson) => lesson.description),
    });
  }

  async onCourseNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      name,
    });
  }

  async onCourseDescriptionUpdated(
    event: EventType<{
      description: string;
    }>,
  ) {
    const { description } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      description,
    });
  }

  async onCourseCategoryUpdated(
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

  async onCourseImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.index.partialUpdateObject({
      objectID: event.dispatcherId,
      image,
    });
  }
}
