import { MongoUser, Optional } from '@app/core';
import { Model } from 'mongoose';
import { UserRepository } from '../../application/repositories/user.repository';
import { User } from '../../application/models/user.model';

export class MongoUserRepository implements UserRepository {
  constructor(private readonly userModel: Model<MongoUser>) {}

  async findUserById(userId: string): Promise<Optional<User>> {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) return Optional.empty();

    return Optional.of(
      new User(user.id, user.name, user.email, user.phone, user.image),
    );
  }
}
