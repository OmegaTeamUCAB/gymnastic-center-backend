import { ApplicationService, Result } from '@app/core';
import { CreateUserDto, CreateUserResponse } from './types';
import { UserRepository } from '../../../domain/repositories';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { User } from '../../../domain/entities';

export class CreateUserCommand
  implements ApplicationService<CreateUserDto, CreateUserResponse>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(data: CreateUserDto): Promise<Result<CreateUserResponse>> {
    const id = this.idGenerator.generateId();
    const user = new User(
      id,
      data.fullName,
      data.email,
      data.phoneNumber,
      data.birthDate,
      data.gender,
      data.stats,
    );

    await this.userRepository.saveUser(user);

    return Result.success<CreateUserResponse>({
      id,
    });
  }
}