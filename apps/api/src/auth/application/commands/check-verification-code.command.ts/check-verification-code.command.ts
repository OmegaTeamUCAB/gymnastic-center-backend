import { ApplicationService, Result } from '@app/core';
import { CheckVerificationCodeDto } from './types';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import {
  CodeExpiredException,
  InvalidCodeException,
  UserNotFoundException,
} from '../../exceptions';

export class CheckVerificationCodeCommand
  implements ApplicationService<CheckVerificationCodeDto, void>
{
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async execute(data: CheckVerificationCodeDto): Promise<Result<void>> {
    const credentials = await this.credentialsRepository.findCredentialsByEmail(
      data.email,
    );
    if (!credentials) return Result.failure(new UserNotFoundException());
    if (
      !credentials.verificationCode ||
      credentials.verificationCode !== data.code
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
