import { Result, Service } from '@app/core';
import { MarkReadCommand, MarkReadResponse } from './types';
import { NotificationRepository } from '../../repositories/notification.repository';
import { NotificationNotFoundException } from '../../exceptions/notification-not-found.exception';

export class MarkReadCommandHandler
  implements Service<MarkReadCommand, MarkReadResponse>
{
  constructor(
    private readonly notificationsRepository: NotificationRepository,
  ) {}

  async execute(command: MarkReadCommand): Promise<Result<MarkReadResponse>> {
    const notification = await this.notificationsRepository.getNotification(
      command.notificationId,
    );
    if (!notification.hasValue)
      return Result.failure(new NotificationNotFoundException());
    await this.notificationsRepository.markNotificationRead(
      notification.unwrap(),
    );
    return Result.success({
      id: command.notificationId,
    });
  }
}
