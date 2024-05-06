import { ApplicationService, CryptoService, Result } from '@app/core';
import { ResetPasswordDto } from './types';
import { IAuthRepository } from '../../repositories/auth.repository';
import {
  CodeExpiredException,
  InvalidCodeException,
  UserNotFoundException,
} from '../../exceptions';

export class ResetPasswordCommand
  implements ApplicationService<ResetPasswordDto, void>
{
  constructor(
    private readonly repository: IAuthRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(data: ResetPasswordDto): Promise<Result<void>> {
    const user = await this.repository.findByEmail(data.email);
    if (!user) return Result.failure(new UserNotFoundException());
    if (!user.verificationCode)
      return Result.failure(new InvalidCodeException());
    if (!user.codeExpirationDate || user.codeExpirationDate < new Date())
      return Result.failure(new CodeExpiredException());
    user.password = await this.cryptoService.hash(data.newPassword);
    user.verificationCode = null;
    user.codeExpirationDate = null;
    await this.repository.save(user);
    return Result.success(null);
  }
}
