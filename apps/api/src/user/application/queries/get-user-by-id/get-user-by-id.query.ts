import { ApplicationService, Result } from '@app/core';
import { GetUserByIdDto, GetUserByIdResponse } from './types';
import { UserRepository } from '../../../domain/repositories';
import { UserNotFoundException } from '../../exceptions';
export class GetUserByIdQuery
  implements ApplicationService<GetUserByIdDto, GetUserByIdResponse>
{
  constructor(public readonly userRepository: UserRepository) {}

  async execute(data: GetUserByIdDto): Promise<Result<GetUserByIdResponse>> {
    const user = await this.userRepository.findUserById(data.id);
    if (!user) return Result.failure(new UserNotFoundException());

    return Result.success({
      id: data.id,
      fullName: user.getName(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber(),
      birthDate: user.getBirthDate(),
      gender: user.getGender(),
      stats: user.getStats(),
    });
  }
}
