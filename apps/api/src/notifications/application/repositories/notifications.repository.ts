import { Optional } from '@app/core';
import { Notification } from '../models/notification';

export interface NotificationsRepository {
  getNotification(id: string): Promise<Optional<Notification>>;
  deleteAllUserNotifications(userId: string): Promise<void>;
  markNotificationRead(notification: Notification): Promise<void>;
}
