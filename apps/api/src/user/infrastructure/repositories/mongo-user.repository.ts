import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../domain/repositories';
import { MongoUser, UserDocument } from '../models/mongo-user.model';
import { User } from '../../domain/entities';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(MongoUser.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      email,
    });
    return user
      ? new User(
          user.id,
          user.fullName,
          user.email,
          user.phoneNumber,
          user.birthDate,
          user.gender,
          user.stats,
        )
      : null;
  }

  async saveUser(user: User): Promise<void> {
    await this.userModel.updateOne(
      {
        id: user.getId(),
      },
      {
        $set: {
          fullName: user.getName(),
          email: user.getEmail(),
          phoneNumber: user.getPhoneNumber(),
          birthDate: user.getBirthDate(),
          gender: user.getGender(),
          stats: user.getStats(),
        },
      },
      {
        upsert: true,
      },
    );
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({
      id: id,
    });

    const { fullName, email, phoneNumber, birthDate, gender, stats } = user;

    return user
      ? new User(id, fullName, email, phoneNumber, birthDate, gender, stats)
      : null;
  }

  async findAllUsers(): Promise<User[]> {
    return (await this.userModel.find()).map(
      ({ id, fullName, email, phoneNumber, birthDate, gender, stats }) =>
        new User(id, fullName, email, phoneNumber, birthDate, gender, stats),
    );
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userModel.deleteOne({
      id: id,
    });
  }
}
