import { MongoUser } from '@app/core';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserNotFoundException } from 'apps/api/src/auth/application/exceptions';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Model } from 'mongoose';
import { UserResponse } from '../controllers/responses';


export class GetUserInformationQuery {
  constructor(
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  async execute(id: string): Promise<UserResponse> {
    const user = await this.userModel.findOne({
      id,
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
}
