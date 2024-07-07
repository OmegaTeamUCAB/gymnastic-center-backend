import { MongoCourse } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseLeanResponse } from '../controllers/responses';

type Dto = {
  instructorId: string;
  categoryId: string;
  filter: string;
  page: number;
  perPage: number;
};

export class GetAllCoursesQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
  ) {}

  async execute(dto: Dto): Promise<CourseLeanResponse[]> {
    const { instructorId, categoryId, filter, page, perPage } = dto;
    const courses = await this.courseModel.find(
      {
        ...(instructorId && { 'trainer.id': instructorId }),
        ...(categoryId && { 'category.id': categoryId }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        limit: perPage,
        sort: filter === 'POPULAR' ? { views: -1 } : { publishDate: -1 },
      },
    );
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
