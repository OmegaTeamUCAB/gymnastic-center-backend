import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoNotification } from '../models/mongo-notification.model';
import { NotificationsRepository } from '../../application/repositories/notifications.repository';
import { Optional } from '@app/core';
import { Notification } from '../../application/models/notification';

export class MongoNotificationsRepository implements NotificationsRepository {
  constructor(
    @InjectModel(MongoNotification.name)
    private readonly notificationModel: Model<MongoNotification>,
  ) {}

  async getNotification(id: string): Promise<Optional<Notification>> {
    const notification = await this.notificationModel.findOne({
      id,
    });
    return notification
      ? Optional.of({
          id: notification.id,
          body: notification.body,
          read: notification.read,
          title: notification.title,
          user: notification.user,
          date: notification.date,
        })
      : Optional.empty();
  }

  async deleteAllUserNotifications(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({
      user: userId,
    });
  }

  async markNotificationRead(notification: Notification): Promise<void> {
    await this.notificationModel.updateOne(
      {
        id: notification.id,
      },
      {
        read: true,
      },
    );
  }
}
