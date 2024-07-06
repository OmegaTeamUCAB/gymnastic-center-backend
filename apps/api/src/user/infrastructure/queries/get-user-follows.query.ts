import { CountResponse, MongoCourse, MongoUser } from '@app/core';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Model } from 'mongoose';

type Dto = {
  credentials: Credentials;
};

export class GetUserFollowsQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly userModel: Model<MongoUser>,
  ) {}

  async execute(dto: Dto): Promise<CountResponse> {
    const { credentials } = dto;
    const user = await this.userModel.findOne({ id: credentials.userId });
    if (!user) throw new NotFoundException('User follows not found');
    return {
      count: user.follows,
    };
  }
}
