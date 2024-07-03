import { Model } from 'mongoose';
import { Credentials } from '../../application/models/credentials.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CredentialsRepository } from '../../application/repositories/credentials.repository';
import { MongoCredentials } from '../models/mongo-credentials.model';
import { Optional } from '@app/core';

@Injectable()
export class MongoCredentialsRepository implements CredentialsRepository {
  constructor(
    @InjectModel(MongoCredentials.name)
    private readonly mongoCredentialsModel: Model<MongoCredentials>,
  ) {}

  async saveCredentials(user: Credentials): Promise<void> {
    await this.mongoCredentialsModel.updateOne(
      {
        userId: user.userId,
      },
      {
        $set: {
          email: user.email,
          password: user.password,
          verificationCode: user.verificationCode ?? null,
          codeExpirationDate: user.codeExpirationDate ?? null,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async findCredentialsByUserId(
    userId: string,
  ): Promise<Optional<Credentials>> {
    const user = await this.mongoCredentialsModel.findOne({ userId });
    if (!user) return Optional.empty();
    return Optional.of(
      new Credentials(
        user.userId,
        user.email,
        user.password,
        user.devices,
        user.verificationCode,
        user.codeExpirationDate,
      )
    );
  }

  async findCredentialsByEmail(email: string): Promise<Credentials | null> {
    const user = await this.mongoCredentialsModel.findOne({ email });
    if (!user) {
      return null;
    }
    return new Credentials(
      user.userId,
      user.email,
      user.password,
      user.devices,
      user.verificationCode,
      user.codeExpirationDate,
    );
  }

  async hasDevice({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }): Promise<boolean> {
    const user = await this.mongoCredentialsModel.findOne({
      userId,
      devices: deviceId,
    });
    return !!user;
  }

  async addDevice({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }): Promise<void> {
    await this.mongoCredentialsModel.updateOne(
      {
        userId,
      },
      {
        $push: {
          devices: deviceId,
        },
      },
    );
  }
}
