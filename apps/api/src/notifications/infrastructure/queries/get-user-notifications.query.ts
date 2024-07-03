import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoNotification } from '../models/mongo-notification.model';
import { ManyNotificationsResponse } from '../controllers/responses';

type Dto = {
  userId: string;
  page: number;
  perPage: number;
};

@Injectable()
export class GetUserNotificationsQuery {
  constructor(
    @InjectModel(MongoNotification.name)
    private readonly notificationModel: Model<MongoNotification>,
  ) {}

  async execute(dto: Dto): Promise<ManyNotificationsResponse[]> {
    const { page, perPage, userId } = dto;
    const notifications = await this.notificationModel.find(
      {
        user: userId,
      },
      undefined,
      {
        limit: perPage,
        skip: (page - 1) * perPage,
        sort: {
          date: -1,
        },
      },
    );
    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      date: notification.date,
      readed: notification.read,
    }));
  }
}
