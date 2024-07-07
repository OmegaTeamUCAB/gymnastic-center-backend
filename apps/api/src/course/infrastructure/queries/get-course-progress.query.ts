import { MongoProgress } from '@app/core';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { Model } from 'mongoose';
import { ProgressResponse } from '../controllers/responses';

type Dto = {
  credentials: Credentials;
  courseId: string;
};

export class GetCourseProgressQuery {
  constructor(
    @InjectModel(MongoProgress.name)
    private readonly progressModel: Model<MongoProgress>,
  ) {}

  async execute(dto: Dto): Promise<ProgressResponse> {
    const { credentials, courseId } = dto;
    const progress = await this.progressModel.findOne({
      courseId,
      userId: credentials.userId,
    });
    if (!progress) throw new NotFoundException('Progress not found');
    return {
      percent: progress.percent,
      lessons: progress.lessons.map((lesson) => ({
        lessonId: lesson.id,
        time: lesson.time,
        percent: lesson.percent,
      })),
    };
  }
}
