import { ITokenGenerator, ICrypto, ApplicationService, Result } from '@app/core';
import { LoginDto, LoginResponse } from './types';
import { UserNotFound } from '../../exceptions/user-not-found.exception';
import { InvalidPass } from '../../exceptions/invalid-pass-exception';
import { IAuthRepository } from '../../repositories/auth.repository';

export class LoginUserCommand implements ApplicationService<LoginDto, LoginResponse>{
    constructor(
        private readonly authRepository: IAuthRepository,
        private readonly jwtService: ITokenGenerator<{ id: string }>,
        private readonly bcrypt: ICrypto
    ) { }

    public async execute(data: LoginDto): Promise<Result<LoginResponse>> {
        const user = await this.authRepository.findByEmail(data.email);
        if (!user) {
            return Result.failure<LoginResponse>(new UserNotFound());
        }
        if (!(await this.bcrypt.compare(data.password, user.password))) {
            return Result.failure<LoginResponse>(new InvalidPass());
        }
        const payload = { id: user.id };
        return Result.success<LoginResponse>({ id: this.jwtService.generateToken(payload) });
    }
}