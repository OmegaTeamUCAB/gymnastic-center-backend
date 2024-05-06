import { CryptoService, ApplicationService, Result } from '@app/core';
import { IAuthRepository } from '../../repositories/auth.repository';
import { SignUpDTO, SignUpResponse } from './types';
import { AuthUser } from '../../models/auth-user.model';
import { TokenGenerator } from '../../token/token-generator.interface';

export class SignUpCommand
  implements ApplicationService<SignUpDTO, SignUpResponse>
{
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    private readonly bcrypt: CryptoService,
  ) {}

  public async execute(data: SignUpDTO): Promise<Result<SignUpResponse>> {
    const hashedPassword = await this.bcrypt.hash(data.password);
    const user = new AuthUser(data.id, data.email, hashedPassword);
    await this.authRepository.save(user);
    const payload = { id: user.id };
    return Result.success<SignUpResponse>({
      token: this.jwtService.generateToken(payload),
    });
  }
}
