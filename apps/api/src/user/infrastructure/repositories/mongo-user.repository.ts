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

  async saveUser(user: User): Promise<void> {
    await this.userModel.updateOne(
      {
        id: user.getId(),
      },
      {
        $set: {
          name: user.getName(),
          lastName: user.getLastName(),
          email: user.getEmail(),
          phoneNumber: user.getPhoneNumber(),
          password: user.getPassword(),
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

    const {
      name,
      lastName,
      email,
      phoneNumber,
      password,
      birthDate,
      gender,
      stats,
    } = user;

    return user
      ? new User(
          id,
          name,
          lastName,
          email,
          phoneNumber,
          password,
          birthDate,
          gender,
          stats,
        )
      : null;
  }

  async findAllUsers(): Promise<User[]> {
    return (await this.userModel.find()).map(
      ({
        id,
        name,
        lastName,
        email,
        phoneNumber,
        password,
        birthDate,
        gender,
        stats,
      }) =>
        new User(
          id,
          name,
          lastName,
          email,
          phoneNumber,
          password,
          birthDate,
          gender,
          stats,
        ),
    );
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userModel.deleteOne({
        id: id
    })
  }
}
