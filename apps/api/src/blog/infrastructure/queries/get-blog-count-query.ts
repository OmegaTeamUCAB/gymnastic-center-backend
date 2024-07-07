import { CountResponse, MongoBlog } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type Dto = {
  instructorId: string;
  categoryId: string;
};

export class GetBlogCountQuery {
  constructor(
    @InjectModel(MongoBlog.name)
    private readonly blogModel: Model<MongoBlog>,
  ) {}

  async execute(dto: Dto): Promise<CountResponse> {
    const { instructorId, categoryId } = dto;
    const count = await this.blogModel.countDocuments({
      ...(instructorId && { 'trainer.id': instructorId }),
      ...(categoryId && { 'category.id': categoryId }),
    });
    return {
      count,
    };
  }
}
