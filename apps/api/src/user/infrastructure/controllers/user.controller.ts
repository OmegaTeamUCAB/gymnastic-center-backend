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
  CryptoService,
  EVENT_STORE,
  EventStore,
  ILogger,
  IdGenerator,
  IdResponse,
  LOCAL_EVENT_HANDLER,
  LOGGER,
  LoggingDecorator,
  MongoUser,
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
import { LocalEventHandler } from '@app/core/infrastructure/event-handler/providers/local-event-handler';
import { CreateUserCommandHandler } from '../../application/commands/create-user';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from 'apps/api/src/auth/application/exceptions';
import { UpdateUserCommandHandler } from '../../application/commands/update-user-by-id';
import { UserCreated, UserCreatedEvent } from '../../domain/events';

@Controller()
@ApiTags('Users & Auth')
export class UserController {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: LocalEventHandler,
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
      const loginService = new LoginCommandHandler(
        this.repository,
        this.jwtService,
        this.bcryptService,
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
    try {
      if (await this.repository.findCredentialsByEmail(signUpDto.email))
        throw new UserAlreadyExistsException(signUpDto.email);

      const signUpService = new SignUpCommandHandler(
        this.repository,
        this.jwtService,
        this.bcryptService,
      );
      const suscription = this.localEventHandler.subscribe(
        UserCreated.name,
        async (event: UserCreatedEvent) => {
          await signUpService.execute({
            id: event.dispatcherId,
            email: event.context.email,
            password: signUpDto.password,
          });
        },
      );

      const service = new CreateUserCommandHandler(
        this.uuidGenerator,
        this.eventStore,
        this.localEventHandler,
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
  async currentUser(@CurrentUser() credentials: Credentials) {
    const user = await this.userModel.findOne({
      id: credentials.userId,
    });
    if (!user) throw new NotFoundException(new UserNotFoundException());
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
    };
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
    const service = new LoggingDecorator(
      new UpdateUserCommandHandler(this.eventStore, this.localEventHandler),
      this.logger,
      'Update User',
    );
    const result = await service.execute({
      id: credentials.userId,
      ...updateUserDto,
    });
    return result.unwrap();
  }
}
