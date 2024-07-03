import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoNotification } from '../models/mongo-notification.model';

type Dto = {
  userId: string;
};

@Injectable()
export class NotReadCountQuery {
  constructor(
    @InjectModel(MongoNotification.name)
    private readonly notificationModel: Model<MongoNotification>,
  ) {}

  async execute(dto: Dto): Promise<number> {
    const { userId } = dto;
    const count = await this.notificationModel.countDocuments({
      user: userId,
      read: false,
    });
    return count;
  }
}
