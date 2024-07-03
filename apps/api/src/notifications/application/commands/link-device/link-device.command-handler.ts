import { Result, Service } from '@app/core';
import { LinkDeviceCommand } from './types/command.type';
import { CredentialsRepository } from 'apps/api/src/auth/application';

export class LinkDeviceCommandHandler
  implements Service<LinkDeviceCommand, void>
{
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async execute(command: LinkDeviceCommand): Promise<Result<void>> {
    if (
      await this.credentialsRepository.hasDevice({
        userId: command.userId,
        deviceId: command.deviceId,
      })
    )
      return Result.success(null);
    await this.credentialsRepository.addDevice({
      userId: command.userId,
      deviceId: command.deviceId,
    });
    return Result.success(null);
  }
}
