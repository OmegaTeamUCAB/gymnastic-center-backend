import { MongoProgress } from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Model } from 'mongoose';
import { ProgressLeanResponse } from '../controllers/responses';

type Dto = {
  credentials: Credentials;
  perPage: number;
  page: number;
};

export class GetWatchingCoursesQuery {
  constructor(
    @InjectModel(MongoProgress.name)
    private readonly progressModel: Model<MongoProgress>,
  ) {}

  async execute(dto: Dto): Promise<ProgressLeanResponse[]> {
    const { credentials, perPage, page } = dto;
    const progress = await this.progressModel.find(
      {
        userId: credentials.userId,
      },
      undefined,
      { skip: (page - 1) * perPage, limit: perPage, sort: { lastTime: -1 } },
    );
    return progress.map((p) => ({
      id: p.courseId,
      percent: p.percent,
      title: p.title,
      image: p.image,
      date: p.publishDate,
      category: p.category.name,
      trainer: p.trainer.name,
    }));
  }
}
