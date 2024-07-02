import { CryptoService, Service, Result } from '@app/core';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import { SignUpCommand, SignUpResponse } from './types';
import { Credentials } from '../../models/credentials.model';
import { TokenGenerator } from '../../token/token-generator.interface';

export class SignUpCommandHandler
  implements Service<SignUpCommand, SignUpResponse>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    private readonly cryptoService: CryptoService,
  ) {}

  public async execute(
    command: SignUpCommand,
  ): Promise<Result<SignUpResponse>> {
    const hashedPassword = await this.cryptoService.hash(command.password);
    const credentials = new Credentials(
      command.id,
      command.email,
      hashedPassword,
    );
    await this.credentialsRepository.saveCredentials(credentials);
    const payload = { id: credentials.userId };
    return Result.success<SignUpResponse>({
      token: this.jwtService.generateToken(payload),
    });
  }
}
