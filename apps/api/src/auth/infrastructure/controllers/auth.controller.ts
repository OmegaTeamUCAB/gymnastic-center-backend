import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dtos';
import {
  LoginUserCommand,
  RegisterUserCommand,
} from '../../application/commands';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(LoginUserCommand) private readonly loginCommand: LoginUserCommand,
    @Inject(RegisterUserCommand)
    private readonly registerCommand: RegisterUserCommand,
  ) {}

  @Post(':login')
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.loginCommand.execute(loginDto);
    return result.unwrap();
  }

  @Post(':register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.registerCommand.execute(registerDto);
    return result.unwrap();
  }
}
