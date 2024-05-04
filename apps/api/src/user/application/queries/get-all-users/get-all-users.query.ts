import { ApplicationService, Result } from '@app/core';
import { GetAllUsersResponse } from './types';
import { UserRepository } from '../../../domain/repositories';

export class GetAllUsersQuery
  implements ApplicationService<void, GetAllUsersResponse>
{
  constructor(public readonly userRepository: UserRepository) {}

  async execute(): Promise<Result<GetAllUsersResponse>> {
    const users = await this.userRepository.findAllUsers();
    if (users.length === 0) return Result.success<GetAllUsersResponse>([]);
    return Result.success<GetAllUsersResponse>(
      users.map(
        ({
          id,
          name,
          lastName,
          email,
          phoneNumber,
          password,
          birthDate,
          gender,
          stats,
        }) => ({
          id,
          name,
          lastName,
          email,
          phoneNumber,
          password,
          birthDate,
          gender,
          stats,
        }),
      ),
    );
  }
}
