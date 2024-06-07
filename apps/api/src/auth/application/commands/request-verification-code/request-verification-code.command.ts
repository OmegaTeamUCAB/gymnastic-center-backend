import {
  ApplicationService,
  Result,
  EmailHandler,
  CodeGenerator,
} from '@app/core';
import { RequestVerificationCodeDto } from './types';
import { UserNotFoundException } from '../../exceptions';
import { CredentialsRepository } from '../../repositories/credentials.repository';

export class RequestVerificationCodeCommand
  implements ApplicationService<RequestVerificationCodeDto, void>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly emailHandler: EmailHandler<{ code: string }>,
    private readonly codeGenerator: CodeGenerator<string>,
  ) {}

  async execute(data: RequestVerificationCodeDto): Promise<Result<void>> {
    const credentials = await this.credentialsRepository.findCredentialsByEmail(data.email);
    if (!credentials) return Result.failure<void>(new UserNotFoundException());
    const code = this.codeGenerator.generateRandomCode();
    credentials.verificationCode = code;
    credentials.codeExpirationDate = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    await Promise.all([
      this.emailHandler.sendEmail(credentials.email, { code }),
      this.credentialsRepository.saveCredentials(credentials),
    ]);
    return Result.success<void>(null);
  }
}
