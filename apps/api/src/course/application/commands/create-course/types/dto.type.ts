export type CreateCourseDto = {
  name: string;
  description: string;
  level: number;
  tags: string[];
  weeks: number;
  minutes: number;
  imageUrl: string;
  categoryId: string;
  instructorId: string;
  lessons: CreateLessonsDto;
};

export type CreateLessonsDto = {
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
}[];
