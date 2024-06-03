import { ApplicationService, CryptoService, Result } from '@app/core';
import { CheckVerificationCodeDto } from './types';
import { IAuthRepository } from '../../repositories/credentials.repository';
import {
  CodeExpiredException,
  InvalidCodeException,
  UserNotFoundException,
} from '../../exceptions';

export class CheckVerificationCodeCommand
  implements ApplicationService<CheckVerificationCodeDto, void>
{
  constructor(
    private readonly repository: IAuthRepository,
  ) {}

  async execute(data: CheckVerificationCodeDto): Promise<Result<void>> {
    const user = await this.repository.findByEmail(data.email);
    if (!user) return Result.failure(new UserNotFoundException());
    if (!user.verificationCode || user.verificationCode !== data.code)
      return Result.failure(new InvalidCodeException());
    if (!user.codeExpirationDate || user.codeExpirationDate < new Date())
      return Result.failure(new CodeExpiredException());
    user.verificationCode = null;
    user.codeExpirationDate = null;
    await this.repository.save(user);
    return Result.success(null);
  }
}
