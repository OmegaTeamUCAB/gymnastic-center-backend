import { MongoCategory, MongoCourse, MongoInstructor } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projector } from '../../types/projector.interface';
import { EventType } from '../../types';

@Injectable()
export class MongoCourseProjector implements Projector {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  async clear() {
    await this.courseModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
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
    const {
      name,
      description,
      level,
      tags,
      weeks,
      minutes,
      image,
      publishDate,
      lessons,
    } = event.context;
    const [category, instructor] = await Promise.all([
      this.categoryModel.findOne({ id: event.context.category }),
      this.instructorModel.findOne({ id: event.context.instructor }),
    ]);
    if (!category || !instructor) return;
    await this.courseModel.create({
      id: event.dispatcherId,
      title: name,
      description,
      level,
      tags,
      weeks,
      minutes,
      image,
      publishDate,
      category: {
        id: category.id,
        name: category.name,
      },
      trainer: {
        id: instructor.id,
        name: instructor.name,
        image: instructor.image,
      },
      lessons,
    });
  }

  async onCourseNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.courseModel.updateOne(
      { id: event.dispatcherId },
      { title: name },
    );
  }

  async onCourseDescriptionUpdated(
    event: EventType<{
      description: string;
    }>,
  ) {
    const { description } = event.context;
    await this.courseModel.updateOne(
      { id: event.dispatcherId },
      { description },
    );
  }

  async onCourseLevelUpdated(
    event: EventType<{
      level: number;
    }>,
  ) {
    const { level } = event.context;
    await this.courseModel.updateOne({ id: event.dispatcherId }, { level });
  }

  async onCourseTagsUpdated(
    event: EventType<{
      tags: string[];
    }>,
  ) {
    const { tags } = event.context;
    await this.courseModel.updateOne({ id: event.dispatcherId }, { tags });
  }

  async onCourseWeeksUpdated(
    event: EventType<{
      weeks: number;
      minutes: number;
    }>,
  ) {
    const { weeks, minutes } = event.context;
    await this.courseModel.updateOne(
      { id: event.dispatcherId },
      { weeks, minutes },
    );
  }

  async onCourseImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.courseModel.updateOne({ id: event.dispatcherId }, { image });
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
    await this.courseModel.updateOne(
      { id: event.dispatcherId },
      {
        category: {
          id: category.id,
          name: category.name,
        },
      },
    );
  }

  async onCategoryNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.courseModel.updateMany(
      {
        'category.id': event.dispatcherId,
      },
      {
        'category.name': name,
      },
    );
  }

  async onInstructorNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.courseModel.updateMany(
      { 'trainer.id': event.dispatcherId },
      { 'trainer.name': name },
    );
  }

  async onInstructorImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.courseModel.updateMany(
      { 'trainer.id': event.dispatcherId },
      { 'trainer.image': image },
    );
  }
}
