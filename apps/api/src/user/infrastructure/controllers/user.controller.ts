import { Controller, Get, Post, Body, Param, Delete, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_REPOSITORY } from '../constants';
import { UserRepository } from '../../domain/repositories';
import { UUIDGENERATOR } from '@app/core/infrastructure/uuid/constants';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { UserResponse } from './responses';
import { GetAllUsersQuery } from '../../application/queries/get-all-users';
import { GetUserByIdQuery } from '../../application/queries/get-user-by-id';
import { CreateUserCommand } from '../../application/commands/create-user';
import { UpdateUserCommand } from '../../application/commands/update-user-by-id/update-user-by-id.command';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IdResponse } from '@app/core';

@Controller('users')
@ApiTags('Users')
export class UserController {

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(UUIDGENERATOR)
        private readonly uuidGenerator: IdGenerator<string>
    ) { }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Users list',
        type: [UserResponse]
    })
    async findAllUsers() {
        const service = new GetAllUsersQuery(this.userRepository);
        const result = await service.execute();
        return result.unwrap();
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'User found',
        type: UserResponse
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async findUserById(@Param('id', ParseUUIDPipe) id: string) {
        const service = new GetUserByIdQuery(this.userRepository);
        const result = await service.execute({ id });
        return result.unwrap();
    }

    @Post()
    @ApiResponse({
        status: 200,
        description: 'User created'
    })
    async createUser(@Body() createUserDto: CreateUserDto) {
        const service = new CreateUserCommand(
            this.userRepository,
            this.uuidGenerator
        );
        const result = await service.execute(createUserDto);
        return result.unwrap();
    }

    @Post(':id')
    @ApiResponse({
        status: 200,
        description: 'User updated',
        type: IdResponse
    })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        const service = new UpdateUserCommand(this.userRepository);
        const result = await service.execute({ id, ...updateUserDto });
        return result.unwrap()
    }

}
