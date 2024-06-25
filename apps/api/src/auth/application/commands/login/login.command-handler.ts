import { CryptoService, Service, Result } from '@app/core';
import { LoginCommand, LoginResponse } from './types';
import {
  UserNotFoundException,
  InvalidPasswordException,
} from '../../exceptions';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import { TokenGenerator } from '../../token/token-generator.interface';

export class LoginCommandHandler
  implements Service<LoginCommand, LoginResponse>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    private readonly cryptoService: CryptoService,
  ) {}

  public async execute(command: LoginCommand): Promise<Result<LoginResponse>> {
    const credentials = await this.credentialsRepository.findCredentialsByEmail(command.email);
    if (!credentials) {
      return Result.failure<LoginResponse>(new UserNotFoundException());
    }
    if (!(await this.cryptoService.compare(command.password, credentials.password))) {
      return Result.failure<LoginResponse>(new InvalidPasswordException());
    }
    const payload = { id: credentials.userId };
    return Result.success<LoginResponse>({
      token: this.jwtService.generateToken(payload),
      id: credentials.userId,
    });
  }
}
