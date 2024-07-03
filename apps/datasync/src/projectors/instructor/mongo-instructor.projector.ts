import { MongoInstructor } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projector } from '../../types/projector.interface';
import { EventType } from '../../types';

@Injectable()
export class MongoInstructorProjector implements Projector {
  constructor(
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  async clear() {
    await this.instructorModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onInstructorCreated(
    event: EventType<{
      name: string;
      image: string;
      city: string;
      country: string;
    }>,
  ) {
    const { name, image, city, country } = event.context;
    await this.instructorModel.create({
      id: event.dispatcherId,
      name,
      image,
      city,
      country,
      followerCount: 0,
      followers: [],
    });
  }

  async onInstructorNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.instructorModel.updateOne({ id: event.dispatcherId }, { name });
  }

  async onInstructorImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.instructorModel.updateOne({ id: event.dispatcherId }, { image });
  }

  async onInstructorFollowed(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.instructorModel.updateOne(
      { id: event.dispatcherId },
      { $push: { followers: user }, $inc: { followerCount: 1 } },
    );
  }

  async onInstructorUnfollowed(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.instructorModel.updateOne(
      { id: event.dispatcherId },
      { $pull: { followers: user }, $inc: { followerCount: -1 } },
    );
  }
}
