import { MongoBlog, MongoCategory, MongoInstructor } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType, Projector } from '../../types';

@Injectable()
export class MongoBlogProjector implements Projector {
  constructor(
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  async clear() {
    await this.blogModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
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
    if (!category || !instructor) return;
    const { title, content, creationDate, images, tags } = event.context;
    await this.blogModel.create({
      id: event.dispatcherId,
      title,
      content,
      uploadDate: creationDate,
      images,
      tags,
      category: { id: category.id, name: category.name },
      trainer: {
        id: instructor.id,
        name: instructor.name,
        image: instructor.image,
      },
      categoryId: category,
      trainerId: instructor,
    });
  }

  async onBlogTitleUpdated(
    event: EventType<{
      title: string;
    }>,
  ) {
    const { title } = event.context;
    await this.blogModel.updateOne({ id: event.dispatcherId }, { title });
  }

  async onBlogContentUpdated(
    event: EventType<{
      content: string;
    }>,
  ) {
    const { content } = event.context;
    await this.blogModel.updateOne({ id: event.dispatcherId }, { content });
  }

  async onBlogImagesUpdated(
    event: EventType<{
      images: string[];
    }>,
  ) {
    const { images } = event.context;
    await this.blogModel.updateOne({ id: event.dispatcherId }, { images });
  }

  async onBlogTagsUpdated(
    event: EventType<{
      tags: string[];
    }>,
  ) {
    const { tags } = event.context;
    await this.blogModel.updateOne({ id: event.dispatcherId }, { tags });
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
    await this.blogModel.updateOne(
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
    await this.blogModel.updateMany(
      {
        'category.id': event.dispatcherId,
      },
      { 'category.name': name },
    );
  }

  async onInstructorNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.blogModel.updateMany(
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
    await this.blogModel.updateMany(
      { 'trainer.id': event.dispatcherId },
      { 'trainer.image': image },
    );
  }

  async onCommentCreated(
    data: EventType<{
      content: string;
      publisher: string;
      blog: string;
    }>,
  ) {
    const { blog } = data.context;
    await this.blogModel.updateOne({ id: blog }, { $inc: { comments: 1 } });
  }
}
