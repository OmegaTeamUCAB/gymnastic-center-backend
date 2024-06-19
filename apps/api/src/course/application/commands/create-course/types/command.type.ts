export type CreateCourseCommand = {
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  image: string;
  categoryId: string;
  instructorId: string;
  lessons: CreateLessonDto[];
};

export type CreateLessonDto = {
  title: string;
  description: string;
  video: string;
};
