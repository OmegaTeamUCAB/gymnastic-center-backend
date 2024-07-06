import {
  Controller,
  Body,
  Inject,
  Put,
  Post,
  UnauthorizedException,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, LoginDto, SignUpDto } from './dtos';
import {
  BCRYPT_SERVICE,
  CountResponse,
  CryptoService,
  EVENT_STORE,
  EventStore,
  ILogger,
  IdGenerator,
  IdResponse,
  LOGGER,
  LoggingDecorator,
  MongoUser,
  NativeTimer,
  PerformanceMonitorDecorator,
  UUIDGENERATOR,
} from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import {
  CredentialsRepository,
  LoginCommandHandler,
  SignUpCommandHandler,
  TokenGenerator,
} from 'apps/api/src/auth/application';
import {
  AUTH_REPOSITORY,
  JWT_SERVICE,
} from 'apps/api/src/auth/infrastructure/constants';
import { AuthResponse } from 'apps/api/src/auth/infrastructure/controllers/responses';
import { UserResponse } from './responses';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { CreateUserCommandHandler } from '../../application/commands/create-user/create-user.command-handler';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from 'apps/api/src/auth/application/exceptions';
import { UpdateUserCommandHandler } from '../../application/commands/update-user/update-user.command-handler';
import { UserCreated, UserCreatedEvent } from '../../domain/events';
import { GetUserFollowsQuery, GetUserInformationQuery } from '../queries';

@Controller()
@ApiTags('Users & Auth')
export class UserController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
    @Inject(AUTH_REPOSITORY)
    private readonly repository: CredentialsRepository,
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(JWT_SERVICE)
    private readonly jwtService: TokenGenerator<string, { id: string }>,
    @Inject(BCRYPT_SERVICE)
    private readonly bcryptService: CryptoService,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly getUserInformationQuery: GetUserInformationQuery,
    private readonly getUserFollowsQuery: GetUserFollowsQuery,
  ) {}

  @Post('auth/login')
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const operationName = 'Login';
    try {
      const loginService = new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new LoginCommandHandler(
            this.repository,
            this.jwtService,
            this.bcryptService,
          ),
          new NativeTimer(),
          this.logger,
          operationName,
        ),
        this.logger,
        operationName,
      );
      const loginResult = await loginService.execute(loginDto);
      const { token, id } = loginResult.unwrap();
      const user = await this.userModel.findOne({
        id,
      });
      if (!user) throw new NotFoundException(new UserNotFoundException());
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
        },
      };
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
    const signUpOperationName = 'Sign Up';
    try {
      if (await this.repository.findCredentialsByEmail(signUpDto.email))
        throw new UserAlreadyExistsException(signUpDto.email);
      const signUpService = new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new SignUpCommandHandler(
            this.repository,
            this.jwtService,
            this.bcryptService,
          ),
          new NativeTimer(),
          this.logger,
          signUpOperationName,
        ),
        this.logger,
        signUpOperationName,
      );
      const suscription = this.eventStore.subscribe(
        UserCreated.name,
        async (event: UserCreatedEvent) => {
          await signUpService.execute({
            id: event.dispatcherId,
            email: event.context.email,
            password: signUpDto.password,
          });
        },
      );
      const createUserOperationName = 'Create User';
      const service = new LoggingDecorator(
        new PerformanceMonitorDecorator(
          new CreateUserCommandHandler(this.uuidGenerator, this.eventStore),
          new NativeTimer(),
          this.logger,
          createUserOperationName,
        ),
        this.logger,
        createUserOperationName,
      );
      const result = await service.execute({ ...signUpDto });
      suscription.unsubscribe();
      return result.unwrap();
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
  currentUser(@CurrentUser() credentials: Credentials): Promise<UserResponse> {
    return this.getUserInformationQuery.execute({ credentials });
  }

  @Put('user/update')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: IdResponse,
  })
  async updateUserById(
    @CurrentUser() credentials: Credentials,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const operationName = 'Update User';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new UpdateUserCommandHandler(this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute({
      id: credentials.userId,
      ...updateUserDto,
    });
    return result.unwrap();
  }

  @Get('trainer/user/follow')
  @Auth()
  async countUserFollows(
    @CurrentUser() credentials: Credentials,
  ): Promise<CountResponse> {
    return this.getUserFollowsQuery.execute({ credentials });
  }
}
