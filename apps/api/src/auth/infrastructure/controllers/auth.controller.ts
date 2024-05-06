import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RequestVerificationCodeDto, SignUpDto } from './dtos';
import {
  AUTH_REPOSITORY,
  CODE_GENERATOR,
  JWT_SERVICE,
  VERIFICATION_EMAIL_HANDLER,
} from '../constants';
import {
  IAuthRepository,
  LoginCommand,
  RequestVerificationCodeCommand,
  SignUpCommand,
} from '../../application';
import {
  BCRYPT_SERVICE,
  CryptoService,
  UUIDGENERATOR,
  IdGenerator,
  EmailHandler,
  CodeGenerator,
} from '@app/core';
import { TokenGenerator } from '../../application/token/token-generator.interface';
import { Auth, CurrentUser } from '../decorators';

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
  ) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const loginService = new LoginCommand(
      this.repository,
      this.jwtService,
      this.bcryptService,
    );
    const loginResult = await loginService.execute(loginDto);
    const { token, id } = loginResult.unwrap();
    //TODO: buscar usuario por id
  }

  @Post('signUp')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signUp(@Body() signUpDto: SignUpDto) {
    const signUpService = new SignUpCommand(
      this.repository,
      this.jwtService,
      this.bcryptService,
    );
    //TODO: llamar servicio de crear usuario y pasarle el id que retorna al signUpDto
    //const signUpResult = await service.execute({id, email, password});
    //const { token } = signUpResult.unwrap();
  }

  @Get('currentUser')
  @Auth()
  @ApiResponse({ status: 200, description: 'User information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currentUser(@CurrentUser() user: any) {
    // TODO: chequear que esto funciona
    return user;
  }

  @Post('requestCode')
  @ApiResponse({ status: 200, description: 'Code requested' })
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
}
