import { MongoUser, Optional } from '@app/core';
import { Model } from 'mongoose';
import { UserRepository } from '../../application/repositories/user.repository';
import { User } from '../../application/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(MongoUser.name) private readonly userModel: Model<MongoUser>,
  ) {}

  async findUserById(userId: string): Promise<Optional<User>> {
    const user = await this.userModel.findOne({ id: userId });

    return user
      ? Optional.of({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
        })
      : Optional.empty();
  }
}
