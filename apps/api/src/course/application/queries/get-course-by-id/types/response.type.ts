import { GetLessonsResponse } from '../../types';

export type GetCourseByIdResponse = {
  id: string;
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  imageUrl: string;
  categoryId: string;
  instructorId: string;
  lessons: GetLessonsResponse;
};
