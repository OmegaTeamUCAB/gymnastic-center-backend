import { MongoProgress } from '@app/core';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Model } from 'mongoose';
import { TrendingProgressResponse } from '../controllers/responses';

export class GetLastWatchedCoursesQuery {
  constructor(
    @InjectModel(MongoProgress.name)
    private readonly progressModel: Model<MongoProgress>,
  ) {}

  async execute(credentials: Credentials): Promise<TrendingProgressResponse> {
    const progress = await this.progressModel.findOne(
      {
        userId: credentials.userId,
      },
      undefined,
      { sort: { lastTime: -1 } },
    );
    if (!progress) throw new NotFoundException('Progress not found');
    return {
      percent: progress.percent,
      courseId: progress.courseId,
      courseTitle: progress.title,
      lastTime: progress.lastTime,
    };
  }
}
