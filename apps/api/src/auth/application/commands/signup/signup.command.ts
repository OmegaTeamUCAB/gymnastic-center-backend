import { CryptoService, ApplicationService, Result } from '@app/core';
import { CredentialsRepository } from '../../repositories/credentials.repository';
import { SignUpDTO, SignUpResponse } from './types';
import { Credentials } from '../../models/credentials.model';
import { TokenGenerator } from '../../token/token-generator.interface';

export class SignUpCommand
  implements ApplicationService<SignUpDTO, SignUpResponse>
{
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    private readonly cryptoService: CryptoService,
  ) {}

  public async execute(data: SignUpDTO): Promise<Result<SignUpResponse>> {
    const hashedPassword = await this.cryptoService.hash(data.password);
    const credentials = new Credentials(data.id, data.email, hashedPassword);
    await this.credentialsRepository.saveCredentials(credentials);
    const payload = { id: credentials.userId };
    return Result.success<SignUpResponse>({
      token: this.jwtService.generateToken(payload),
    });
  }
}
