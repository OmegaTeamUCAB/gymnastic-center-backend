import { MongoInstructor, MongoQuestion, MongoUser } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType, Projector } from '../../types';

@Injectable()
export class MongoQuestionProjector implements Projector {
  constructor(
    @InjectModel(MongoQuestion.name)
    private readonly questionModel: Model<MongoQuestion>,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  async clear() {
    await this.questionModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onQuestionCreated(
    event: EventType<{
      questionId: string;
      user: string;
      lesson: string;
      content: string;
      date: Date;
    }>,
  ) {
    const { questionId, content, lesson, user, date } = event.context;
    const publisher = await this.userModel.findOne({ id: user });
    if (!publisher) return;
    await this.questionModel.create({
      id: questionId,
      content,
      lesson,
      publisher: {
        id: publisher.id,
        name: publisher.name,
        image: publisher.image,
      },
      publishDate: date,
    });
  }

  async onQuestionAnswered(
    event: EventType<{
      answerId: string;
      questionId: string;
      instructor: string;
      content: string;
      date: Date;
    }>,
  ) {
    const { answerId, questionId, content, date, instructor } = event.context;
    const publisher = await this.instructorModel.findOne({ id: instructor });
    if (!publisher) return;
    await this.questionModel.updateOne(
      { id: questionId },
      {
        answer: {
          id: answerId,
          answer: content,
          date: date,
          instructor: {
            id: publisher.id,
            name: publisher.name,
            image: publisher.image,
          },
        },
      },
    );
  }

  async onUserNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.questionModel.updateMany(
      { 'publisher.id': event.dispatcherId },
      { 'publisher.name': name },
    );
  }

  async onUserImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.questionModel.updateMany(
      { 'publisher.id': event.dispatcherId },
      { 'publisher.image': image },
    );
  }

  async onInstructorNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.questionModel.updateMany(
      { 'answer.instructor.id': event.dispatcherId },
      { 'answer.instructor.name': name },
    );
  }

  async onInstructorImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.questionModel.updateMany(
      { 'answer.instructor.id': event.dispatcherId },
      { 'answer.instructor.image': image },
    );
  }
}
