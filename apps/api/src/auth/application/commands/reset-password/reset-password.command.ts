import { ApplicationService, CryptoService, Result } from '@app/core';
import { ResetPasswordDto } from './types';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import { CodeExpiredException, InvalidCodeException, UserNotFoundException } from '../../exceptions';

export class ResetPasswordCommand
  implements ApplicationService<ResetPasswordDto, void>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(data: ResetPasswordDto): Promise<Result<void>> {
    const credentials = await this.credentialsRepository.findCredentialsByEmail(data.email);
    if (!credentials) return Result.failure(new UserNotFoundException());
    if (!credentials.verificationCode || credentials.verificationCode !== data.code)
      return Result.failure(new InvalidCodeException());
    if (!credentials.codeExpirationDate || credentials.codeExpirationDate < new Date())
      return Result.failure(new CodeExpiredException());
    credentials.password = await this.cryptoService.hash(data.newPassword);
    credentials.verificationCode = null;
    credentials.codeExpirationDate = null;
    await this.credentialsRepository.saveCredentials(credentials);
    return Result.success(null);
  }
}
