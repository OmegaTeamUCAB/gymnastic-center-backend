import { Controller, Post, Body, Inject, Get, UnauthorizedException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckCodeDto,
  LoginDto,
  RequestVerificationCodeDto,
  SignUpDto,
} from './dtos';
import {
  AUTH_REPOSITORY,
  CODE_GENERATOR,
  JWT_SERVICE,
  VERIFICATION_EMAIL_HANDLER,
} from '../constants';
import {
  CheckVerificationCodeCommand,
  IAuthRepository,
  LoginCommand,
  RequestVerificationCodeCommand,
  ResetPasswordCommand,
  SignUpCommand,
} from '../../application';
import {
  BCRYPT_SERVICE,
  CryptoService,
  UUIDGENERATOR,
  IdGenerator,
  EmailHandler,
  CodeGenerator,
  SuccessBasedResponse,
} from '@app/core';
import { TokenGenerator } from '../../application/token/token-generator.interface';
import { Auth, CurrentUser } from '../decorators';
import { USER_REPOSITORY } from 'apps/api/src/user/infrastructure/constants';
import { UserRepository } from 'apps/api/src/user/domain/repositories';
import { GetUserByIdQuery } from 'apps/api/src/user/application/queries/get-user-by-id';
import { CreateUserCommand } from 'apps/api/src/user/application/commands/create-user';
import { User } from 'apps/api/src/user/domain/entities';
import { AuthResponse } from './responses';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly repository: IAuthRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(BCRYPT_SERVICE)
    private readonly bcryptService: CryptoService,
    @Inject(JWT_SERVICE)
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    @Inject(CODE_GENERATOR)
    private readonly codeGenerator: CodeGenerator<string>,
    @Inject(VERIFICATION_EMAIL_HANDLER)
    private readonly verificationEmailHandler: EmailHandler<{ code: string }>,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const loginService = new LoginCommand(
        this.repository,
        this.jwtService,
        this.bcryptService,
      );
      const loginResult = await loginService.execute(loginDto);
      const { token, id } = loginResult.unwrap();
      const service = new GetUserByIdQuery(this.userRepository);
      const result = await service.execute({ id });
      return { token, user: result.unwrap() };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('signUp')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const signUpService = new SignUpCommand(
        this.repository,
        this.jwtService,
        this.bcryptService,
      );
      const service = new CreateUserCommand(this.userRepository, this.uuidGenerator);
      const result = await service.execute({ ...signUpDto })
      const id = result.unwrap().id;
      const signUpResult = await signUpService.execute({ id ,...signUpDto});
      const { token } = signUpResult.unwrap();
      return {token, user: signUpDto};
    } catch (error) {
      throw new UnauthorizedException(error.message); 
    }
  }

  @Get('currentUser')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currentUser(@CurrentUser() user: User) {
    return {
      user,
      token: this.jwtService.generateToken({ id: user.id }),
    };
  }

  @Post('requestCode')
  @ApiResponse({
    status: 200,
    description: 'Code requested',
    type: SuccessBasedResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async requestVerificationCode(
    @Body() requestVerificationCodeDto: RequestVerificationCodeDto,
  ) {
    const service = new RequestVerificationCodeCommand(
      this.repository,
      this.verificationEmailHandler,
      this.codeGenerator,
    );
    const result = await service.execute(requestVerificationCodeDto);
    result.unwrap();
    return {
      success: true,
    };
  }

  @Post('checkCode')
  @ApiResponse({
    status: 200,
    description: 'Code checked successfully',
    type: SuccessBasedResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  @ApiResponse({ status: 400, description: 'Code expired' })
  async checkVerificationCode(@Body() checkCodeDto: CheckCodeDto) {
    const service = new CheckVerificationCodeCommand(this.repository);
    const result = await service.execute(checkCodeDto);
    result.unwrap();
    return {
      success: true,
    };
  }

  @Post('resetPassword')
  @ApiResponse({
    status: 200,
    description: 'Password reset',
    type: SuccessBasedResponse,
  })
  @ApiResponse({ status: 400, description: 'No code requested' })
  async resetPassword(@Body() loginDto: LoginDto) {
    const service = new ResetPasswordCommand(
      this.repository,
      this.bcryptService,
    );
    const result = await service.execute({
      email: loginDto.email,
      newPassword: loginDto.password,
    });
    result.unwrap();
    return {
      success: true,
    };
  }
}
