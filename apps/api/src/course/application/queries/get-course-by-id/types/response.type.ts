export type GetCourseByIdResponse = {
  id: string;
  title: string;
  description: string;
  level: number;
  tags: string[];
  durationWeeks: number;
  durationMinutes: number;
  image: string;
  category: string;
  trainer: string;
  lessons: GetLessonsResponse;
};

export type GetLessonsResponse = {
  id: string;
  title: string;
  content: string;
  video?: string;
  image?: string;
}[];
