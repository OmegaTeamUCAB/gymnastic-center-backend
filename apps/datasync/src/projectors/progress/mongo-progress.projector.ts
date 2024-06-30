import { MongoCategory, MongoCourse, MongoProgress } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projector } from '../../types/projector.interface';
import { EventType } from '../../types';

@Injectable()
export class MongoProgressProjector implements Projector {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
    @InjectModel(MongoCategory.name)
    private readonly categoryModel: Model<MongoCategory>,
    @InjectModel(MongoProgress.name)
    private readonly progressModel: Model<MongoProgress>,
  ) {}

  async clear() {
    await this.progressModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onCourseNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.progressModel.updateMany(
      { courseId: event.dispatcherId },
      { title: name },
    );
  }

  async onCourseImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.progressModel.updateMany(
      { courseId: event.dispatcherId },
      { image },
    );
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
    await this.progressModel.updateMany(
      { courseId: event.dispatcherId },
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
    const courses = await this.courseModel.find({
      'category.id': event.dispatcherId,
    });
    await this.progressModel.updateMany(
      { courseId: { $in: courses.map((course) => course.id) } },
      {
        category: {
          id: event.dispatcherId,
          name,
        },
      },
    );
  }

  async onInstructorNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    const courses = await this.courseModel.find({
      'trainer.id': event.dispatcherId,
    });
    await this.progressModel.updateMany(
      { courseId: { $in: courses.map((course) => course.id) } },
      {
        trainer: {
          id: event.dispatcherId,
          name,
        },
      },
    );
  }

  async onCourseStarted(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    const course = await this.courseModel.findOne({ id: event.dispatcherId });
    if (!course) return;
    await this.progressModel.create({
      courseId: course.id,
      userId: user,
      title: course.title,
      image: course.image,
      category: {
        id: course.category.id,
        name: course.category.name,
      },
      trainer: {
        id: course.trainer.id,
        name: course.trainer.name,
      },
      percent: 0,
      lastTime: new Date(),
      publishDate: course.publishDate,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        time: 0,
        percent: 0,
      })),
    });
  }

  async onCourseLessonWatched(
    event: EventType<{
      user: string;
      lesson: string;
      completionPercentage: number;
      lastSecondWatched: number;
    }>,
  ) {
    const { user, lesson, completionPercentage, lastSecondWatched } =
      event.context;
    const progress = await this.progressModel.findOneAndUpdate(
      {
        courseId: event.dispatcherId,
        userId: user,
      },
      {
        lastTime: event.timestamp,
        $set: {
          'lessons.$[lesson].percent': completionPercentage,
          'lessons.$[lesson].time': lastSecondWatched,
        },
      },
      {
        arrayFilters: [{ 'lesson.id': lesson }],
        new: true,
      },
    );
    if (!progress) return;
    const averageCompletionPercentage =
      progress.lessons.reduce((acc, lesson) => acc + lesson.percent, 0) /
      progress.lessons.length;
    progress.percent = Math.round(averageCompletionPercentage * 100) / 100;
    await progress.save();
  }

  async onCourseCompleted(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.progressModel.updateOne(
      {
        courseId: event.dispatcherId,
        userId: user,
      },
      {
        $set: {
          'lessons.$[].percent': 100,
        },
      },
    );
  }
}
