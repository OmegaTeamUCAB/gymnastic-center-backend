import { ApplicationService, Result } from '@app/core';
import { DeleteUserDto } from './types';
import { DeleteUSerResponse } from './types/response.type';
import { UserRepository } from '../../../domain/repositories';

export class DeleteUserCommand
  implements ApplicationService<DeleteUserDto, DeleteUSerResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: DeleteUserDto): Promise<Result<DeleteUSerResponse>> {
    this.userRepository.deleteUserById(data.id);
    return Result.success<DeleteUSerResponse>({
      id: data.id,
    });
  }
}
