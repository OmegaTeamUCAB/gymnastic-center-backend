import {
  ITokenGenerator,
  ICrypto,
  ApplicationService,
  Result,
} from '@app/core';
import { UUIDService } from '@app/core/infrastructure/uuid/providers/uuid.service';
import { IAuthRepository } from '../../repositories/auth.repository';
import { RegisterDto } from '../../../infrastructure/controllers/dtos';
import { AuthUser } from '../../models/auth-user.model';
import { RegisterResponse } from './types';

export class RegisterUserCommand
  implements ApplicationService<RegisterDto, RegisterResponse>
{
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: ITokenGenerator<{ id: string }>,
    private readonly bcrypt: ICrypto,
  ) {}

  public async execute(data: RegisterDto): Promise<Result<RegisterResponse>> {
    const hashedPassword = await this.bcrypt.hash(data.password, 10);
    const newUser = new AuthUser(
      UUIDService.generateUUID(),
      data.email,
      hashedPassword,
    );
    await this.authRepository.save(newUser);
    const payload = { id: newUser.id };
    return Result.success<RegisterResponse>({
      id: this.jwtService.generateToken(payload),
    });
  }
}
