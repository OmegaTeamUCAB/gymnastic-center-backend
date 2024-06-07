import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckCodeDto,
  RequestVerificationCodeDto,
  ResetPasswordDto,
} from './dtos';
import {
  AUTH_REPOSITORY,
  CODE_GENERATOR,
  VERIFICATION_EMAIL_HANDLER,
} from '../constants';
import {
  CheckVerificationCodeCommand,
  CredentialsRepository,
  RequestVerificationCodeCommand,
  ResetPasswordCommand,
} from '../../application';
import {
  BCRYPT_SERVICE,
  CryptoService,
  EmailHandler,
  CodeGenerator,
  SuccessBasedResponse,
  DateBasedResponse,
} from '@app/core';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly repository: CredentialsRepository,
    @Inject(BCRYPT_SERVICE)
    private readonly bcryptService: CryptoService,
    @Inject(CODE_GENERATOR)
    private readonly codeGenerator: CodeGenerator<string>,
    @Inject(VERIFICATION_EMAIL_HANDLER)
    private readonly verificationEmailHandler: EmailHandler<{ code: string }>,
  ) {}

  @Post('forget/password')
  @ApiResponse({
    status: 200,
    description: 'Code sent',
    type: DateBasedResponse,
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
      date: new Date(),
    };
  }

  @Post('code/validate')
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

  @Put('change/password')
  @ApiResponse({
    status: 200,
    description: 'Password reset',
    type: SuccessBasedResponse,
  })
  @ApiResponse({ status: 400, description: 'No code requested' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  @ApiResponse({ status: 400, description: 'Code expired' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const service = new ResetPasswordCommand(
      this.repository,
      this.bcryptService,
    );
    const result = await service.execute({
      email: resetPasswordDto.email,
      newPassword: resetPasswordDto.password,
      code: resetPasswordDto.code,
    });
    result.unwrap();
    return {
      success: true,
    };
  }
}
