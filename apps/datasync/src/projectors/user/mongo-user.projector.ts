import { MongoUser } from '@app/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projector } from '../../types/projector.interface';
import { EventType } from '../../types';

@Injectable()
export class MongoUserProjector implements Projector {
  constructor(
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  async clear() {
    await this.userModel.deleteMany();
  }

  async project(event: EventType): Promise<void> {
    const handler = this[`on${event.name}`];
    if (handler) await handler.call(this, event);
  }

  async onUserCreated(
    event: EventType<{
      name: string;
      email: string;
      phone: string;
    }>,
  ) {
    const { name, email, phone } = event.context;
    try {
      await this.userModel.create({
        id: event.dispatcherId,
        name,
        email,
        phone,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onUserNameUpdated(
    event: EventType<{
      name: string;
    }>,
  ) {
    const { name } = event.context;
    await this.userModel.updateOne({ id: event.dispatcherId }, { name });
  }

  async onUserPhoneUpdated(
    event: EventType<{
      phone: string;
    }>,
  ) {
    const { phone } = event.context;
    await this.userModel.updateOne({ id: event.dispatcherId }, { phone });
  }

  async onUserImageUpdated(
    event: EventType<{
      image: string;
    }>,
  ) {
    const { image } = event.context;
    await this.userModel.updateOne({ id: event.dispatcherId }, { image });
  }

  async onInstructorFollowed(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.userModel.updateOne({ id: user }, { $inc: { follows: 1 } });
  }

  async onInstructorUnfollowed(
    event: EventType<{
      user: string;
    }>,
  ) {
    const { user } = event.context;
    await this.userModel.updateOne({ id: user }, { $inc: { follows: -1 } });
  }
}
