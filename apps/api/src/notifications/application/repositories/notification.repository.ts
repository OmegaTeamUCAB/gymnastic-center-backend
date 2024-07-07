import { Optional } from '@app/core';
import { Notification } from '../models/notification';

export interface NotificationRepository {
  getNotification(id: string): Promise<Optional<Notification>>;
  saveNotification(notification: Notification): Promise<void>;
  deleteAllUserNotifications(userId: string): Promise<void>;
  markNotificationRead(notification: Notification): Promise<void>;
}
