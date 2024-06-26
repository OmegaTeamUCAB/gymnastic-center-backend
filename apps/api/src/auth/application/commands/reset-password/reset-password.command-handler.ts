import { Service, CryptoService, Result } from '@app/core';
import { ResetPasswordCommand } from './types';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import {
  CodeExpiredException,
  InvalidCodeException,
  UserNotFoundException,
} from '../../exceptions';

export class ResetPasswordCommandHandler
  implements Service<ResetPasswordCommand, void>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<Result<void>> {
    const credentials = await this.credentialsRepository.findCredentialsByEmail(
      command.email,
    );
    if (!credentials) return Result.failure(new UserNotFoundException());
    if (
      !credentials.verificationCode ||
      credentials.verificationCode !== command.code
    )
      return Result.failure(new InvalidCodeException());
    if (
      !credentials.codeExpirationDate ||
      credentials.codeExpirationDate < new Date()
    )
      return Result.failure(new CodeExpiredException());
    credentials.password = await this.cryptoService.hash(command.newPassword);
    credentials.verificationCode = null;
    credentials.codeExpirationDate = null;
    await this.credentialsRepository.saveCredentials(credentials);
    return Result.success(null);
  }
}
