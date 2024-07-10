import { MongoCourse } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseLeanResponse } from '../controllers/responses';

type Dto = {
  userId: string;
};

export class GetRecommendedCoursesQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
  ) {}

  async execute(dto: Dto): Promise<CourseLeanResponse[]> {
    const { userId } = dto;
    const courses = await this.courseModel.find({}, null, {
      limit: 3,
      sort: { views: -1 },
    });
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category.name,
      trainer: course.trainer.name,
      image: course.image,
      date: course.publishDate,
    }));
  }
}
