import { MongoInstructor } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { InstructorNotFoundException } from '../../application/exceptions';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { InstructorResponse } from '../responses/instructor.response';

type Dto = {
  id: string;
  credentials: Credentials;
};

export class GetInstructorByIdQuery {
  constructor(
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
  ) {}

  async execute(dto: Dto): Promise<InstructorResponse> {
    const { id, credentials } = dto;
    const instructor = await this.instructorModel.findOne({
      id,
    });
    if (!instructor)
      throw new NotFoundException(new InstructorNotFoundException());
    return {
      id: instructor.id,
      name: instructor.name,
      followers: instructor.followers.length,
      userFollow: instructor.followers.includes(credentials.userId),
      location: `${instructor.city}, ${instructor.country}`,
      image: instructor.image,
    };
  }
}
