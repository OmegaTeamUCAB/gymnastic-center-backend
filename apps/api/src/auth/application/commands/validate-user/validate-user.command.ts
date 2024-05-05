import {
  ITokenGenerator,
  ICrypto,
  ApplicationService,
  Result,
} from '@app/core';
import { ValidateUserDto, ValidateUserResponse } from './types';
import { UserNotFound } from '../../exceptions/user-not-found.exception';
import { InvalidPass } from '../../exceptions/invalid-pass-exception';
import { IAuthRepository } from '../../repositories/auth.repository';

export class ValidateUser
  implements ApplicationService<ValidateUserDto, ValidateUserResponse>
{
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: ITokenGenerator<{ id: string }>,
    private readonly bcrypt: ICrypto,
  ) {}

  public async execute(
    data: ValidateUserDto,
  ): Promise<Result<ValidateUserResponse>> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      return Result.failure<ValidateUserResponse>(new UserNotFound());
    }
    if (!(await this.bcrypt.compare(data.password, user.password))) {
      return Result.failure<ValidateUserResponse>(new InvalidPass());
    }
    const payload = { id: user.id };
    return Result.success<ValidateUserResponse>({
      id: this.jwtService.generateToken(payload),
    });
  }
}

/*
public verifyToken(token: string): any {
    try {
        return this.jwtService.verify(token);
    } catch (error) {
        throw new Error("Verificación de token fallida "+ error.message);
    }
}

public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && await this.bcrypt.compare(password, user.password)) {
        return user;
    }
    return null;
}
*/
