import { MongoInstructor } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstructorResponse } from '../responses/instructor.response';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';

type Dto = {
  credentials: Credentials;
  filter: string;
  page: number;
  perPage: number;
};

export class GetAllInstructorsQuery {
  constructor(
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  async execute(dto: Dto): Promise<InstructorResponse[]> {
    const { credentials, filter, page, perPage } = dto;
    const instructors = await this.instructorModel.find(
      {
        ...(filter === 'FOLLOWING' && { followers: credentials.userId }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        limit: perPage,
      },
    );
    return instructors.map((instructor) => ({
      id: instructor.id,
      name: instructor.name,
      followers: instructor.followerCount,
      userFollow: instructor.followers.includes(credentials.userId),
      location: `${instructor.city}, ${instructor.country}`,
      image: instructor.image,
    }));
  }
}
