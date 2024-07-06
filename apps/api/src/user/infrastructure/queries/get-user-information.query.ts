import { MongoCourse, MongoUser } from '@app/core';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserNotFoundException } from 'apps/api/src/auth/application/exceptions';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Model } from 'mongoose';
import { UserResponse } from '../controllers/responses';

type Dto = {
  credentials: Credentials;
};

export class GetUserInformationQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  async execute(dto: Dto): Promise<UserResponse> {
    const { credentials } = dto;
    const user = await this.userModel.findOne({
      id: credentials.userId,
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
