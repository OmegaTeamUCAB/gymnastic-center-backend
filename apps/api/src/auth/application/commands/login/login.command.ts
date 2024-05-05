import { CryptoService, ApplicationService, Result } from '@app/core';
import { LoginDto, LoginResponse } from './types';
import {
  UserNotFoundException,
  InvalidPasswordException,
} from '../../exceptions';
import { IAuthRepository } from '../../repositories/auth.repository';
import { TokenGenerator } from '../../token/token-generator.interface';

export class LoginCommand
  implements ApplicationService<LoginDto, LoginResponse>
{
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    private readonly bcrypt: CryptoService,
  ) {}

  public async execute(data: LoginDto): Promise<Result<LoginResponse>> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      return Result.failure<LoginResponse>(new UserNotFoundException());
    }
    if (!(await this.bcrypt.compare(data.password, user.password))) {
      return Result.failure<LoginResponse>(new InvalidPasswordException());
    }
    const payload = { id: user.id };
    return Result.success<LoginResponse>({
      token: this.jwtService.generateToken(payload),
      id: user.id,
    });
  }
}
