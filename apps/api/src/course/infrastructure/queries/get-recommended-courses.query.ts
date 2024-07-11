import {
  InjectAlgoliaRecommendations,
  MongoCourse,
  MongoProgress,
} from '@app/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecommendClient } from '@algolia/recommend';
import { CourseLeanResponse } from '../controllers/responses';

type Dto = {
  userId: string;
};

type Hit = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
  category: string;
  instructor: string;
};

export class GetRecommendedCoursesQuery {
  constructor(
    @InjectModel(MongoCourse.name)
    private readonly courseModel: Model<MongoCourse>,
    @InjectModel(MongoProgress.name)
    private readonly progressModel: Model<MongoProgress>,
    @InjectAlgoliaRecommendations()
    private readonly algolia: RecommendClient,
  ) {}

  async execute(dto: Dto): Promise<CourseLeanResponse[]> {
    const { userId } = dto;
    const progress = await this.progressModel.find({ userId }, null, {
      limit: 1,
      sort: { lastTime: -1 },
    });
    if (progress[0]) {
      const recommendations = await this.algolia.getRelatedProducts<Hit>([
        {
          indexName: 'courses',
          objectID: progress[0].courseId,
          maxRecommendations: 5,
        },
      ]);
      return recommendations.results[0].hits.map((hit) => ({
        id: hit.id,
        title: hit.name,
        description: hit.description,
        tags: hit.tags,
        image: hit.image,
        category: hit.category,
        trainer: hit.instructor,
        date: new Date(),
      }));
    }
    const courses = await this.courseModel.find({}, null, {
      limit: 5,
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
