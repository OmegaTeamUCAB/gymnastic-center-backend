import { Model } from 'mongoose';
import { AuthUser } from '../../application/models/auth-user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../application/repositories/auth.repository';
import { MongoAuthUser } from '../models/mongo-auth-user.model';

@Injectable()
export class MongoAuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(MongoAuthUser.name)
    private readonly mongoAuthUserModel: Model<MongoAuthUser>,
  ) {}

  async save(user: AuthUser): Promise<void> {
    await this.mongoAuthUserModel.updateOne(
      {
        aggregateId: user.id,
      },
      {
        $set: {
          email: user.email,
          password: user.password,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.mongoAuthUserModel.findOne({ email });
    if (!user) {
      return null;
    }
    return new AuthUser(user.aggregateId, user.email, user.password);
  }
}
