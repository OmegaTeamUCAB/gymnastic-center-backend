import { ApplicationService, Result } from '@app/core';
import { UpdateUserDto, UpdateUserResponse } from './types';
import { UserRepository } from '../../../domain/repositories';
import { UserNotFoundException } from '../../exceptions/user-not-found';

export class UpdateUserCommand
  implements ApplicationService<UpdateUserDto, UpdateUserResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: UpdateUserDto): Promise<Result<UpdateUserResponse>> {
    const user = await this.userRepository.findUserById(data.id);
    if (!user)
      return Result.failure<UpdateUserResponse>(new UserNotFoundException());
    if (data.fullName) user.setName(data.fullName);
    if (data.email) user.setEmail(data.email);
    if (data.phoneNumber) user.setPhoneNumber(data.phoneNumber);
    if (data.birthDate) user.setBirthDate(data.birthDate);
    if (data.gender) user.setGender(data.gender);
    if (data.stats) user.setStats(data.stats);
    await this.userRepository.saveUser(user);
    return Result.success<UpdateUserResponse>({
      id: user.getId(),
    });
  }
}
