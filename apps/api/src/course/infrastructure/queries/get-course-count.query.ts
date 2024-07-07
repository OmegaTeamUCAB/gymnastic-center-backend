import { CountResponse, MongoCourse } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type Dto = {
  instructorId: string;
  categoryId: string;
};

export class GetCourseCountQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
  ) {}

  async execute(dto: Dto): Promise<CountResponse> {
    const { instructorId, categoryId } = dto;
    const count = await this.courseModel.countDocuments({
      ...(instructorId && { 'trainer.id': instructorId }),
      ...(categoryId && { 'category.id': categoryId }),
    });
    return {
      count,
    };
  }
}
