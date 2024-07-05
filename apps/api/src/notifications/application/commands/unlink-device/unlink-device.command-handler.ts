import { Result, Service } from '@app/core';
import { UnlinkDeviceCommand } from './types/command.type';
import { CredentialsRepository } from 'apps/api/src/auth/application';

export class UnlinkDeviceCommandHandler
  implements Service<UnlinkDeviceCommand, void>
{
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async execute(command: UnlinkDeviceCommand): Promise<Result<void>> {
    if (
      !(await this.credentialsRepository.hasDevice({
        userId: command.userId,
        deviceId: command.deviceId,
      }))
    )
      return Result.success(null);
    await this.credentialsRepository.removeDevice({
      userId: command.userId,
      deviceId: command.deviceId,
    });
    return Result.success(null);
  }
}
