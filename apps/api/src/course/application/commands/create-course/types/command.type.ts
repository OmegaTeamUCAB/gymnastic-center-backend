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
  lessons: {
    title: string;
    description: string;
    video: string;
  }[];
};
