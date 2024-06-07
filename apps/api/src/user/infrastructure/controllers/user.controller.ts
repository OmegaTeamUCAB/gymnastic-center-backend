import {
  Controller,
  Body,
  Delete,
  Inject,
  Put,
  Post,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_REPOSITORY } from '../constants';
import { UserRepository } from '../../domain/repositories';
import { UpdateUserCommand } from '../../application/commands/update-user-by-id/update-user-by-id.command';
import { UpdateUserDto, LoginDto, SignUpDto } from './dtos';
import {
  BCRYPT_SERVICE,
  CryptoService,
  IdGenerator,
  IdResponse,
  UUIDGENERATOR,
} from '@app/core';
import { DeleteUserCommand } from '../../application/commands/delete-user-by-id';
import { Auth, UserIdReq } from 'apps/api/src/auth/infrastructure/decorators';
import {
  CredentialsRepository,
  LoginCommand,
  SignUpCommand,
  TokenGenerator,
} from 'apps/api/src/auth/application';
import {
  AUTH_REPOSITORY,
  JWT_SERVICE,
} from 'apps/api/src/auth/infrastructure/constants';
import { AuthResponse } from 'apps/api/src/auth/infrastructure/controllers/responses';
import { GetUserByIdQuery } from '../../application/queries/get-user-by-id';
import { CreateUserCommand } from '../../application/commands/create-user';
import { UserResponse } from './responses';

@Controller()
@ApiTags('Users & Auth')
export class UserController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(AUTH_REPOSITORY)
    private readonly repository: CredentialsRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(JWT_SERVICE)
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    @Inject(BCRYPT_SERVICE)
    private readonly bcryptService: CryptoService,
  ) {}

  @Post('auth/login')
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

  @Post('auth/register')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: IdResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signUp(@Body() signUpDto: SignUpDto) {
    //TODO: make SignUpCommand react to UserCreated event
    try {
      const signUpService = new SignUpCommand(
        this.repository,
        this.jwtService,
        this.bcryptService,
      );
      const service = new CreateUserCommand(
        this.userRepository,
        this.uuidGenerator,
      );
      const result = await service.execute({ ...signUpDto });
      const id = result.unwrap().id;
      const signUpResult = await signUpService.execute({ id, ...signUpDto });
      signUpResult.unwrap();
      return { id };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get('auth/current')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UserResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currentUser(@UserIdReq() id: string) {
    const service = new GetUserByIdQuery(this.userRepository);
    const result = await service.execute({ id });
    return result.unwrap();
  }

  @Put('user/update')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: IdResponse,
  })
  async updateUserById(
    @UserIdReq() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const service = new UpdateUserCommand(this.userRepository);
    const result = await service.execute({ id, ...updateUserDto });
    return result.unwrap();
  }

  @Delete('user')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: IdResponse,
  })
  async deleteUserById(@UserIdReq() id: string) {
    const service = new DeleteUserCommand(this.userRepository);
    const result = await service.execute({ id });
    return result.unwrap();
  }
}
