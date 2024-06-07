import {
  Controller,
  Body,
  Delete,
  Inject,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { USER_REPOSITORY } from '../constants';
import { UserRepository } from '../../domain/repositories';
import { UpdateUserCommand } from '../../application/commands/update-user-by-id/update-user-by-id.command';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IdResponse } from '@app/core';
import { DeleteUserCommand } from '../../application/commands/delete-user-by-id';
import { Auth, UserIdReq } from 'apps/api/src/auth/infrastructure/decorators';

@Controller('users')
@ApiTags('Users')
@Auth()
export class UserController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  @Put('update')
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

  @Delete()
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
