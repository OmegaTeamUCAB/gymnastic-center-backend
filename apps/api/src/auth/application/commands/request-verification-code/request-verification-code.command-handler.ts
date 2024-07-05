import {
  Service,
  Result,
  EmailHandler,
  CodeGenerator,
} from '@app/core';
import { RequestVerificationCodeCommand } from './types';
import { UserNotFoundException } from '../../exceptions';
import { CredentialsRepository } from '../../repositories/credentials.repository';

export class RequestVerificationCodeCommandHandler
  implements Service<RequestVerificationCodeCommand, void>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly emailHandler: EmailHandler<{ code: string }>,
    private readonly codeGenerator: CodeGenerator<string>,
  ) {}

  async execute(
    command: RequestVerificationCodeCommand,
  ): Promise<Result<void>> {
    const _credentials = await this.credentialsRepository.findCredentialsByEmail(
      command.email,
    );
    if (!_credentials.hasValue) return Result.failure<void>(new UserNotFoundException());
    const credentials = _credentials.unwrap();
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
