import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchClient, SearchIndex } from 'algoliasearch';
import { Model } from 'mongoose';
import {
  InjectAlgolia,
  MongoCategory,
  MongoCourse,
  MongoInstructor,
} from '@app/core';
import { EventType, Projector } from '../../types';

@Injectable()
export class AlgoliaCourseProjector
  implements Projector, OnModuleInit
{
  constructor(
    @InjectAlgolia()
    private readonly algolia: SearchClient,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
  ) {
    this.index = this.algolia.initIndex('course');
  }

  private index: SearchIndex;

  async onModuleInit() {
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
      attributesForFaceting: ['searchable(tags)'],
    });
  }

  async clear() {
    await this.index.clearObjects();
  }

  async project(event: EventType) {
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
    if (!category || !instructor) return;
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
    if (!category) return;
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

  async onCategoryNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    const courses = await this.courseModel.find({
      'category.id': event.dispatcherId,
    });
    await Promise.all(
      courses.map((course) =>
        this.index.partialUpdateObject({
          objectID: course.id,
          category: name,
        }),
      ),
    );
  }
}
