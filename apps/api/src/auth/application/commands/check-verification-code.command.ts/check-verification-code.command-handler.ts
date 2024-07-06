import { Service, Result } from '@app/core';
import { CheckVerificationCodeCommand } from './types';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import {
  CodeExpiredException,
  InvalidCodeException,
  UserNotFoundException,
} from '../../exceptions';

export class CheckVerificationCodeCommandHandler
  implements Service<CheckVerificationCodeCommand, void>
{
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async execute(command: CheckVerificationCodeCommand): Promise<Result<void>> {
    const _credentials =
      await this.credentialsRepository.findCredentialsByEmail(command.email);
    if (!_credentials.hasValue)
      return Result.failure(new UserNotFoundException());
    const credentials = _credentials.unwrap();
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
    return Result.success(null);
  }
}
