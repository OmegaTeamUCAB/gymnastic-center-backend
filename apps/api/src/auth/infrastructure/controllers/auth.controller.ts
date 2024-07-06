import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
  UnauthorizedException,
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
  CheckVerificationCodeCommandHandler,
  CredentialsRepository,
  RequestVerificationCodeCommandHandler,
  ResetPasswordCommandHandler,
} from '../../application';
import {
  BCRYPT_SERVICE,
  CryptoService,
  EmailHandler,
  CodeGenerator,
  SuccessBasedResponse,
  DateBasedResponse,
  ILogger,
  LOGGER,
  LoggingDecorator,
  PerformanceMonitorDecorator,
  NativeTimer,
  ExceptionParserDecorator,
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
    @Inject(LOGGER)
    private readonly logger: ILogger,
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
    const operationName = 'Request Verification Code';
    try {
      const service = new ExceptionParserDecorator(
        new LoggingDecorator(
          new PerformanceMonitorDecorator(
            new RequestVerificationCodeCommandHandler(
              this.repository,
              this.verificationEmailHandler,
              this.codeGenerator,
            ),
            new NativeTimer(),
            this.logger,
            operationName,
          ),
          this.logger,
          operationName,
        ),
        (error) => {
          throw new UnauthorizedException(error.message);
        },
      );
      const result = await service.execute(requestVerificationCodeDto);
      result.unwrap();
      return {
        date: new Date(),
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
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
    const operationName = 'Check Verification Code';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new CheckVerificationCodeCommandHandler(this.repository),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      (error) => {
        throw new UnauthorizedException(error.message);
      },
    );
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
    const operationName = 'Reset Password';
    const service = new ExceptionParserDecorator(
      new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new ResetPasswordCommandHandler(this.repository, this.bcryptService),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      ),
      (error) => {
        throw new UnauthorizedException(error.message);
      },
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
