import {
  ApplicationService,
  Result,
  EmailHandler,
  CodeGenerator,
} from '@app/core';
import { RequestVerificationCodeDto } from './types';
import { UserNotFoundException } from '../../exceptions';
import { IAuthRepository } from '../../repositories/auth.repository';

export class RequestVerificationCodeCommand
  implements ApplicationService<RequestVerificationCodeDto, void>
{
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly emailHandler: EmailHandler<{ code: string }>,
    private readonly codeGenerator: CodeGenerator<string>,
  ) {}

  async execute(data: RequestVerificationCodeDto): Promise<Result<void>> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) return Result.failure<void>(new UserNotFoundException());
    const code = this.codeGenerator.generateRandomCode();
    user.verificationCode = code;
    user.codeExpirationDate = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    await Promise.all([
      this.emailHandler.sendEmail(user.email, { code }),
      this.authRepository.save(user),
    ]);
    return Result.success<void>(null);
  }
}
