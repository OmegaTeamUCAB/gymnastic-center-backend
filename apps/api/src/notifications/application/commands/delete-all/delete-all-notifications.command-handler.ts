import { Result, Service } from '@app/core';
import { DeleteAllNotificationsCommand } from './types/command.type';
import { NotificationsRepository } from '../../repositories/notifications.repository';

export class DeleteAllNotificationsCommandHandler
  implements Service<DeleteAllNotificationsCommand, void>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(command: DeleteAllNotificationsCommand): Promise<Result<void>> {
    await this.notificationsRepository.deleteAllUserNotifications(
      command.userId,
    );
    return Result.success(null);
  }
}
