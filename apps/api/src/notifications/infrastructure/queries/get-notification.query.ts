import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoNotification } from '../models/mongo-notification.model';
import { Optional } from '@app/core';
import { OneNotificationResponse } from '../controllers/responses';

type Dto = {
  id: string;
};

@Injectable()
export class GetNotificationQuery {
  constructor(
    @InjectModel(MongoNotification.name)
    private readonly notificationModel: Model<MongoNotification>,
  ) {}

  async execute(dto: Dto): Promise<Optional<OneNotificationResponse>> {
    const { id } = dto;
    const notification = await this.notificationModel.findOne({
      id,
    });
    return notification ? Optional.of(notification) : Optional.empty();
  }
}
